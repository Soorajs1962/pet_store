import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Fetch team members list
export async function GET() {
  try {
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
    
    // Seed default team members if they aren't already present in cookie
    const defaults = [
      { name: "Store Administrator", username: "admin@aurapet.com", phone: "+91 99999 99999", role: "admin" },
      { name: "Store Staff Member", username: "staff@aurapet.com", phone: "+91 88888 88888", role: "staff" }
    ];

    // Combine cookie users with default seeded team users
    const combined = [...defaults];
    users.forEach((u: any) => {
      if (!combined.some(c => c.username.toLowerCase() === u.username.toLowerCase())) {
        combined.push({
          name: u.name,
          username: u.username,
          phone: u.phone || "",
          role: u.role || "customer"
        });
      }
    });

    return NextResponse.json({ success: true, team: combined });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch team list" }, { status: 500 });
  }
}

// Add/Update team member role
export async function POST(req: Request) {
  try {
    const { name, username, password, phone, role } = await req.json();

    if (!name || !username || !role) {
      return NextResponse.json({ error: "Name, Username/Email, and Role are required" }, { status: 400 });
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

    // Check if user already exists in cookie
    const idx = users.findIndex((u: any) => u.username.toLowerCase() === username.toLowerCase());
    
    if (idx !== -1) {
      // Update existing user role
      users[idx].role = role;
      if (name) users[idx].name = name;
      if (phone) users[idx].phone = phone;
      if (password) users[idx].password = password;
    } else {
      // Create new team user
      users.push({
        name,
        username: username.toLowerCase(),
        phone: phone || "",
        password: password || "temp123", // default temp password
        role: role
      });
    }

    cookieStore.set("aura_pet_users", JSON.stringify(users), {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/"
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update team member" }, { status: 500 });
  }
}

// Remove team member
export async function DELETE(req: Request) {
  try {
    const { username } = await req.json();
    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
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

    // Remove user
    users = users.filter((u: any) => u.username.toLowerCase() !== username.toLowerCase());

    cookieStore.set("aura_pet_users", JSON.stringify(users), {
      maxAge: 30 * 24 * 60 * 60,
      path: "/"
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete member" }, { status: 500 });
  }
}
