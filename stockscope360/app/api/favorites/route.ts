import { NextRequest, NextResponse } from "next/server";
import pool from "@/libs/mysql";
import { EditFavoritesArgs } from "@/types";

export async function POST(request: NextRequest) {
  const editFavoritesArgs: EditFavoritesArgs = await request.json();

  const { email, stockId, isFavorite } = editFavoritesArgs;
  try {
    const db = await pool.getConnection();
    const query = isFavorite
      ? `DELETE FROM Favorites
      WHERE UserId = (
          SELECT UserId
          FROM UserInfo
          WHERE Email = '${email}'
      )
      AND StockId = ${stockId};`
      : `INSERT INTO Favorites (UserId, StockId)
      SELECT UserId, ${stockId}
      FROM UserInfo
      WHERE Email = '${email}';`;

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
