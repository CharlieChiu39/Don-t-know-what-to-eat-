/**
 * room.js — Multi-person room logic via Ably
 *
 * Requires Ably Realtime SDK (loaded via CDN in index.html).
 * Free tier: 100 concurrent connections, 3M messages/month.
 *
 * Usage:
 *   const room = new RoomManager(onEvent)
 *   room.create(nickname)
 *   room.join(code, nickname)
 *   room.broadcastSpin(seed, targetIndex, filters)
 *   room.leave()
 */

// NOTE: Replace with your own Ably publishable API key.
// Get one free at https://ably.com (no credit card needed).
const ABLY_KEY = 'YOUR_ABLY_API_KEY_HERE';

class RoomManager {
  constructor(onEvent) {
    this.onEvent   = onEvent;   // callback(type, data)
    this.ably      = null;
    this.channel   = null;
    this.roomCode  = null;
    this.nickname  = null;
    this.isHost    = false;
    this.members   = {};        // clientId → nickname
  }

  /** Generate a random 4-char room code */
  static genCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
  }

  _clientId() {
    // Stable per-browser random ID stored in sessionStorage
    let id = sessionStorage.getItem('_food_cid');
    if (!id) {
      id = Math.random().toString(36).slice(2, 10);
      sessionStorage.setItem('_food_cid', id);
    }
    return id;
  }

  async _connect() {
    if (this.ably) return;
    // Dynamically load Ably SDK
    await new Promise((resolve, reject) => {
      if (window.Ably) return resolve();
      const s = document.createElement('script');
      s.src = 'https://cdn.ably.com/lib/ably.min-2.js';
      s.onload  = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
    this.ably = new Ably.Realtime({
      key:      ABLY_KEY,
      clientId: this._clientId(),
    });
    await new Promise(resolve => {
      this.ably.connection.on('connected', resolve);
    });
  }

  async _subscribe(code) {
    this.roomCode = code;
    this.channel  = this.ably.channels.get(`food-room-${code}`);

    this.channel.subscribe('member_join', (msg) => {
      const { clientId, nickname } = msg.data;
      this.members[clientId] = nickname || clientId.slice(0, 6);
      this.onEvent('members_update', { members: this.members, host: this.isHost });
    });

    this.channel.subscribe('member_leave', (msg) => {
      const { clientId } = msg.data;
      delete this.members[clientId];
      this.onEvent('members_update', { members: this.members, host: this.isHost });
    });

    this.channel.subscribe('start_spin', (msg) => {
      const { seed, targetIndex, filters } = msg.data;
      this.onEvent('start_spin', { seed, targetIndex, filters });
    });

    this.channel.subscribe('spin_result', (msg) => {
      this.onEvent('spin_result', msg.data);
    });

    // Announce self
    await this.channel.publish('member_join', {
      clientId: this._clientId(),
      nickname: this.nickname,
    });
  }

  async create(nickname) {
    await this._connect();
    this.nickname = nickname || '匿名';
    this.isHost   = true;
    const code    = RoomManager.genCode();
    this.members[this._clientId()] = this.nickname;
    await this._subscribe(code);
    this.onEvent('room_created', { code, isHost: true });
  }

  async join(code, nickname) {
    await this._connect();
    this.nickname = nickname || '匿名';
    this.isHost   = false;
    this.members[this._clientId()] = this.nickname;
    await this._subscribe(code.toUpperCase());
    this.onEvent('room_joined', { code: code.toUpperCase(), isHost: false });
  }

  /** Host broadcasts spin command; all clients (incl. host) react */
  async broadcastSpin(seed, targetIndex, filters) {
    if (!this.channel) return;
    await this.channel.publish('start_spin', { seed, targetIndex, filters });
  }

  async leave() {
    if (this.channel) {
      await this.channel.publish('member_leave', { clientId: this._clientId() }).catch(() => {});
      await this.channel.unsubscribe();
    }
    if (this.ably) {
      this.ably.close();
    }
    this.ably     = null;
    this.channel  = null;
    this.roomCode = null;
    this.isHost   = false;
    this.members  = {};
    this.onEvent('left_room', {});
  }

  isConnected() {
    return !!this.channel;
  }

  getCode() { return this.roomCode; }
  getIsHost() { return this.isHost; }
}
