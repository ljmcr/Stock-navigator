import { NextRequest, NextResponse } from "next/server";
import pool from "@/libs/mysql";
import { NewUserArgs } from "@/types";
import { RowDataPacket } from "mysql2";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  try {
    const db = await pool.getConnection();
    const query = `CALL SelectUserInfoByEmail('${email}');`;

    const [rows] = await db.execute<RowDataPacket[]>(query, [email]);
    db.release();

    if (rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const [userInfo] = rows[0] as RowDataPacket[];

    return NextResponse.json(userInfo);
  } catch (error) {
    return NextResponse.json(
      {
        error: error,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const newUserArgs: NewUserArgs = await request.json();

  const { name, email } = newUserArgs;

  const [firstName, lastName] = name.split(" ");

  try {
    const db = await pool.getConnection();
    const query = `CALL InsertOrUpdateUserInfo('${firstName}', '${
      lastName ? lastName : ""
    }', '${email}');`;
    await db.execute(query);
    db.release();

    return NextResponse.json("Success");
  } catch (error) {
    return NextResponse.json(
      {
        error: error,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const newUserArgs: NewUserArgs = await request.json();

  const { name, email, currency } = newUserArgs;

  try {
    const db = await pool.getConnection();
    const query = currency ?
      `CALL UpdateUserCurrency('${email}', ${currency == "USD" ? null : `'${currency}'`});`
     :  `CALL UpdateUserDisplayName('${email}','${name}');`;
    
    await db.execute(query);

    db.release();

    return NextResponse.json("Success");
  } catch (error) {
    return NextResponse.json(
      {
        error: error,
      },
      { status: 500 }
    );
  }
}
