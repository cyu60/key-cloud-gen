// pages/api/magicLoopsProxy.js
import { NextResponse } from "next/server";
import fetch from "node-fetch";

export async function POST(req) {
  try {
    const body = await req.json();
    const magicLoopsResponse = await fetch(
      "https://magicloops.dev/api/loop/run/f05478d9-5e86-4192-82ce-0cb2ea00d1a5",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const data = await magicLoopsResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in Magic Loops Proxy:", error);
    return NextResponse.error();
  }
}
