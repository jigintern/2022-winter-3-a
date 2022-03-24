import { serve } from "https://deno.land/std@0.127.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.127.0/http/file_server.ts";
import { format } from "https://deno.land/std@0.127.0/datetime/mod.ts";
import { Todo } from "./todo.ts";


import { Client } from "https://deno.land/x/postgres@v0.15.0/mod.ts";



// ToDo の API は Todo クラスにまとめてある
const todo = new Todo();

console.log("Listening on http://localhost:8000");

serve((req) => {
    const url = new URL(req.url);
    const pathname = url.pathname;

    console.log("Request:", req.method, pathname);

    // /api/ で始まる場合、API サーバっぽく処理して返す
    if (pathname.startsWith("/api/")) {
        switch (pathname) {
            case "/api/time":
                return apiTime(req);
            case "/api/asmd": // addition, subtraction, multiplication, division の頭文字
                return apiFourArithmeticOperations(req);
            case "/api/reverse":
                return apiReverse(req);
            case "/api/todo/list":
                return todo.apiList(req);
            case "/api/todo/add":
                return todo.apiAdd(req);
            case "/api/todo/delete":
                return todo.apiDelete(req);
            case "/api/answer":
                return Ans(req);
            }
    }
    // pathname に対応する static フォルダのファイルを返す（いわゆるファイルサーバ機能）
    // / → static/index.html
    // /hoge → static/hoge/index.html
    // /fuga.html → static/fuga.html
    // /img/piyo.jpg → static/img/piyo.jpg
    return serveDir(req, {
        fsRoot: "static",
        urlRoot: "",
        showDirListing: true,
        enableCors: true
    });
});

// 従来の function を使った関数宣言
// 現在の日時を返す API
function apiTime(req: Request) {
    return new Response(format(new Date(), "yyyy-MM-dd HH:mm:ss"));
}

async function Ans(req: Request) {
    const params = parseSearchParams(new URL(req.url));
    const id = params.id;
    const answers = await getData();
    const ans: any = answers.rows.find((obj: any) => obj.id === id);
    if(params.answer === (ans.answer === 'True')){
        return Response.redirect('https://jigintern-2022-winter-3-a.deno.dev/ans'+id+'.html');
    }
    else{ 
        return Response.redirect('https://jigintern-2022-winter-3-a.deno.dev/false.html');
    }
}
async function getData() { 
    const client = new Client("postgres://postgres:lockin0624!@db.vxlotgascdtznyrhpjyw.supabase.co:6543/postgres");
    await client.connect();
    
    
    const object_result = await client.queryObject("SELECT * FROM TODOS");
    console.log(object_result.rows); // [{id: 1, name: 'Carlos'}, {id: 2, name: 'John'}, ...]
    
    await client.end();
    return object_result;
}

// アロー関数を使った関数宣言
// クエリパラメータの x と y の四則演算の結果を JSON で返す API
const apiFourArithmeticOperations = (req: Request) => {
    const params = parseSearchParams(new URL(req.url));
    const x = params.x;
    const y = params.y;

    let addition = 0;
    let subtraction = 0;
    let multiplication = 0;
    let division = 0;
    if (typeof x === "number" && typeof y === "number") {
        addition = x + y;
        subtraction = x - y;
        multiplication = x * y;
        division = x / y;
    }
    return createJsonResponse({    
        "user": "太郎",
        "age": 23,
        "gender": "男"
    }
);
}

// URL のクエリパラメータをパースする
const parseSearchParams = (url: URL) => {
    const params: Record<string, string | number | boolean> = {};
    for (const p of url.searchParams) {
        const n = p[0], v = p[1];
        if (v === "")
            params[n] = true;
        else if (v === "true")
            params[n] = true;
        else if (v === "false")
            params[n] = false;
        else if (!isNaN(Number(v)))
            params[n] = +v;
        else
            params[n] = v;
    }
    return params;
};

// JSON のレスポンスを生成する
const createJsonResponse = (obj: any) => new Response(JSON.stringify(obj), {
    headers: {
        "content-type": "application/json; charset=utf-8"
    }
});

// クライアントから送られてきた JSON の message の文字列を反転して返す API
// curl -X POST -d '{ "message": "hello" }' http://localhost:8000/api/reverse
// → {"message":"olleh"}
const apiReverse = async (req: Request) => {
    const json = (await req.json()) as ApiReversePayload;
    const message = json.message;
    const reversedMessage = message.split("").reverse().join("");
    return createJsonResponse({ message: reversedMessage });
};

type ApiReversePayload = {
    message: string;
};
