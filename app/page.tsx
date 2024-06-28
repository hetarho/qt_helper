"use client";

import OpenAI from "openai";
import { useEffect, useState } from "react";

export default function Home() {
  const [verses, setVerses] = useState("");
  const [str, setStr] = useState("");

  async function fetchData() {
    const chapter = 28;
    const startVerse = 1;
    const endVerse = 9;

    const fetchRes = await fetch(
      `https://api.biblesupersearch.com/api?bible=korean&reference=ps${chapter}:${startVerse}-${endVerse}`
    ).then((res) => res.json());

    const verses = fetchRes.results[0].verses.korean;

    let res = "";
    for (let verve in verses[chapter]) {
      res += verses[chapter][verve].text;
    }

    setVerses(res);

    const organization = process.env.NEXT_PUBLIC_ORGANIZATION_ID;
    const project = process.env.NEXT_PUBLIC_PROJECT_ID;
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;

    const openai = new OpenAI({
      organization,
      project,
      apiKey,
      dangerouslyAllowBrowser: true,
    });

    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `
              내가 앞으로 성경 구절을 보낼거야.
              보내는 성경구절을 현대식으로 이해하기 쉬운 문장으로 요약해서 보여줘.
              성경 본문에 나와있지 않은 역사적 사실과 현대식 문체로 이해하기 쉽게 요약해서 알려줘
              나는 내가 보내는 성경 구절이 몇장 몇편인지는 알고싶지 않고 잘 설명해줬으면 좋겠어.
              
              예를들어서

              ~~~~하는 내용입니다. ~~는 ~~했고 ~~는 ~~해서 ~~했습니다. 같은 설명이 필요해
              `,
          },
          {
            role: "user",
            content: res,
          },
        ],
        model: "gpt-3.5-turbo",
      });

      console.log(completion.choices[0].message.content);

      setStr(completion.choices[0].message.content ?? "");
    } catch (error) {}
  }

  return (
    <main className="">
      <div>{verses}</div>
      <div className="mt-4">{str}</div>
      <button onClick={fetchData}>test</button>
    </main>
  );
}
