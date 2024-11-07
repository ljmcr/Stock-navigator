import { NextResponse } from "next/server";
import pool from "@/libs/mysql";
import { IndustryInfo } from "@/types";
import { RowDataPacket } from "mysql2";

export async function GET() {
  try {
    const db = await pool.getConnection();
    const query = `CALL GetUniqueIndustry();`;
    const [rows] = await db.execute<RowDataPacket[]>(query);

    const industryInfo = rows[0] as IndustryInfo[];
    db.release();

    return NextResponse.json(industryInfo);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
