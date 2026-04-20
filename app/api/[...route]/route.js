import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// ─── In-Memory Store (persists across warm invocations) ───
const users = globalThis.__diasense_users || (globalThis.__diasense_users = new Map());

const findByField = (field, value) => {
  for (const [, u] of users) {
    if (u[field]?.toLowerCase() === value.toLowerCase()) return u;
  }
  return null;
};

export async function POST(request, { params }) {
  const route = (await params).route?.join('/') || '';
  const body = await request.json();

  // ── REGISTER ──
  if (route === 'register') {
    const { name, father_name, mobile, email, dob, username, password } = body;
    if (users.has(username.toLowerCase()) || findByField('email', email) || findByField('mobile', mobile)) {
      return NextResponse.json({ detail: 'Username, Email, or Mobile already registered' }, { status: 400 });
    }
    const hashed = await bcrypt.hash(password, 10);
    users.set(username.toLowerCase(), { name, father_name, mobile, email: email.toLowerCase(), dob, username, password: hashed });
    return NextResponse.json({ message: 'User registered successfully', username });
  }

  // ── LOGIN ──
  if (route === 'login') {
    const { login_id, password } = body;
    const user = users.get(login_id.toLowerCase()) || findByField('email', login_id);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ detail: 'Invalid credentials' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Login successful', username: user.username, name: user.name });
  }

  // ── PREDICT ──
  if (route === 'predict') {
    const { pregnancies, glucose, blood_pressure, skin_thickness, insulin, bmi, dpf, age } = body;
    let score = 0;
    if (glucose > 140) score += 2; else if (glucose > 120) score += 1;
    if (bmi > 30) score += 2; else if (bmi > 25) score += 1;
    if (age > 45) score += 1;
    if (blood_pressure > 90) score += 1;
    if (insulin > 200) score += 1;
    if (dpf > 0.5) score += 1;
    if (pregnancies > 5) score += 1;
    if (skin_thickness > 35) score += 1;
    const risk_level = score >= 4 ? 'High' : 'Low';
    const confidence = Math.min(99, 82 + score * 2 + Math.random() * 4).toFixed(2);
    return NextResponse.json({ risk_level, confidence: parseFloat(confidence) });
  }

  // ── FORGOT PASSWORD ──
  if (route === 'forgot-password') {
    const { recovery_id } = body;
    const user = findByField('email', recovery_id) || findByField('mobile', recovery_id);
    if (!user) return NextResponse.json({ detail: 'User not found' }, { status: 404 });
    return NextResponse.json({ message: 'User verified. You can now reset your password.', username: user.username });
  }

  // ── RESET PASSWORD ──
  if (route === 'reset-password') {
    const { recovery_id, new_password } = body;
    const user = findByField('email', recovery_id) || findByField('mobile', recovery_id);
    if (!user) return NextResponse.json({ detail: 'User not found' }, { status: 404 });
    user.password = await bcrypt.hash(new_password, 10);
    return NextResponse.json({ message: 'Password reset successfully' });
  }

  return NextResponse.json({ detail: 'Not found' }, { status: 404 });
}

export async function GET() {
  return NextResponse.json({ status: 'DiaSense API running', users: users.size });
}
