import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { name, username, password, phone } = await req.json();
    
    if (!name || !username || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    
    const cookieStore = await cookies();
    const existingUsersRaw = cookieStore.get("aura_pet_users")?.value;
    let users = [];
    if (existingUsersRaw) {
      try {
        users = JSON.parse(existingUsersRaw);
      } catch {
        users = [];
      }
    }
    
    // Check if username (email or phone) already exists
    const exists = users.some(
      (u: any) => 
        u.username.toLowerCase() === username.toLowerCase() ||
        (phone && u.phone === phone)
    );
    
    if (exists) {
      return NextResponse.json({ error: "Email or Phone already registered" }, { status: 400 });
    }
    
    // Add new user
    users.push({
      name,
      username: username.toLowerCase(),
      phone: phone || "",
      password // storing plain text for simulation, in production it would be hashed
    });
    
    cookieStore.set("aura_pet_users", JSON.stringify(users), {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/"
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
