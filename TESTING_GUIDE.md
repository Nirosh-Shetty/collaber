# Messaging System Testing Guide

## Current Status

✅ Backend: Running on `http://localhost:8000`
✅ Frontend: Running on `http://localhost:3001`
✅ Socket.io has been initialized
✅ `/api/auth/get-socket-token` endpoint secured with auth middleware

## Testing Socket Connection

### Step 1: Open Browser Console
1. Open the app in two different browser windows/tabs or private windows with **different users** logged in
2. In **each window**: Press `F12` to open Developer Tools → Go to **Console** tab

### Step 2: Look for These Logs (In order)

**In Console, you should see:**

```
🎯 SocketProvider mounting...
📡 Fetching socket token from backend...
✅ Socket token fetched successfully
✅ Socket connected: [socket-id-here]
🎣 useMessaging hook called - socket state: { socketExists: true, isConnected: true, socketId: "..." }
```

### Step 3: Send a Test Message

1. In Window 1 (User A):
   - Navigate to Messages → Find User B
   - Type a message: "Test message"
   - Click Send

2. Look for these logs in **Window 1 (Sender)**:
```
📨 Provider sending message via socket: [message text] to: [recipient-id]
✅ Message sent successfully via socket
```

3. Look for these logs in **Window 2 (Recipient)**:
```
📬 Message received from socket: [message text]
```

### Step 4: Verify Message Appears

- The message should appear **instantly** in User B's message list
- Read receipts (✓✓) should appear when message is read

---

## Troubleshooting

### Issue: Socket not connecting

**Check 1: Is `/api/auth/get-socket-token` being called?**
- In Console, look for: `📡 Fetching socket token from backend...`
- If not present, refresh the page

**Check 2: Is the token fetch succeeding?**
- Should see: `✅ Socket token fetched successfully`
- If it fails, the endpoint might be missing or auth middleware issue

**Check 3: Is Socket.io connecting?**
- Should see: `✅ Socket connected: [socket-id]`
- If no connection, check browser Network tab:
  - Look for WebSocket connection to `localhost:8000`
  - Status should be `101 Switching Protocols`

### Issue: Message not sending

**Check 1: Is socket connected?**
```
useMessaging hook - socket state: { socketConnection: true, isConnected: true }
```

**Check 2: Is send button in messages working?**
- Click Send and check for: `📨 Provider sending message...`

**Check 3: Is backend receiving?**
- Check backend console (terminal running `npm run dev`)
- Should see message receiver socket event logs

### Issue: Message appears for sender but not recipients

Check the backend console for:
- `📬 Broadcasting message to conversation room` 
- This confirms message was received and is being broadcast

---

## Network Tab Testing

1. Open DevTools → **Network** tab (in addition to Console)
2. Send a test message
3. Look for these requests:

**Socket Events** (shown as WebSocket):
- Message from `http://localhost:8000` (WebSocket 101 upgrade)

**REST API Calls**:
- `POST /api/messaging/send-message` - Creates message record
- `GET /api/auth/get-socket-token` - Fetches socket token

---

## Full Message Flow

1. **Frontend**: User types message and clicks Send
2. **Frontend**: `useMessaging.sendMessage()` is called
3. **Frontend**: Emits socket event: `send-message`
4. **Backend**: Receives `send-message` event
5. **Backend**: Broadcasts to `conversation:{id}` room
6. **Frontend**: Receives `message` event from socket
7. **Frontend**: Updates message list in real-time

**Expected Time**: Message should appear in recipient's window within **100-500ms**

---

## Database Verification

To verify messages were actually saved:

```javascript
// In browser console after sending a message
// You can check the backend database:
fetch('http://localhost:8000/api/messaging/messages?conversationId=[id]')
  .then(r => r.json())
  .then(d => console.log('Messages:', d))
```

---

## Key Environment Setup

✅ `.env.local` has been created with:
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

✅ Backend auth cookie settings:
```
httpOnly: true     ← Prevents JavaScript access
secure: false      ← Allows HTTP in development
sameSite: "lax"    ← For cross-site requests
```

✅ New endpoint for socket token:
```
GET /api/auth/get-socket-token
Protected by: authMiddleware
Returns: { token: "JWT_TOKEN" }
```

---

## Quick Checklist

Before testing, verify:
- [ ] Backend server running (`npm run dev` in `/backend`)
- [ ] Frontend server running (`npm run dev` in `/frontend`)
- [ ] Two browser windows with different users logged in
- [ ] `.env.local` exists with `NEXT_PUBLIC_BACKEND_URL`
- [ ] DevTools Console open in both windows
- [ ] No TypeScript errors in terminal

---

## Success Criteria

✅ **Socket Connection**: See "✅ Socket connected" in console
✅ **Message Sending**: See "📨 Provider sending message" in console
✅ **Message Reception**: See "📬 Message received" in other window's console
✅ **Real-Time Display**: Message appears in recipient's list within 1 second
✅ **Database**: Message exists in MongoDB after sending

---
