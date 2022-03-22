// ToDo の API の処理をまとめたクラス
export class Todo {
    // ToDo（文字列）の配列
    list: string[];

    constructor() {
        this.list = [];
    }

    // ToDo の一覧を返す API
    apiList(req: Request) {
        return createJsonResponse(this.list);
    }

    // ToDo を登録する API
    async apiAdd(req: Request) {
        const json = await req.json();
        const todo = json.todo as string;

        // 入力された ToDo をチェックする
        if (todo.trim().length === 0) {
            return new Response("ToDo を入力してください。", { status: 400 });
        }

        // ToDo を配列に追加する
        this.list.push(json.todo);

        return new Response("", { status: 201 });
    }

    // ToDo を削除する API
    apiDelete(req: Request) {
        return new Response("ToDo の削除は対応していません", { status: 500 });
    }
}

// JSON のレスポンスを生成する
const createJsonResponse = (obj: any) => new Response(JSON.stringify(obj), {
    headers: {
        "content-type": "application/json; charset=utf-8"
    }
});