import { del, fetch, get, postJson, put, putJson } from "../uitls/fetch";

const prefix = "/api/v1/channel";

export const getChannels = (page: number, pageSize: number) => {
  return fetch(prefix + "/list?page=" + page + "&pageSize=" + pageSize, {
    method: "GET"
  });
};

export const Remove = (id: string) => {
  return del(prefix + "/" + id);
};

export const Add = (data: any) => {
  return postJson(prefix, data);
};

export const Update = (id: string, data: any) => {
  return putJson(prefix + "/" + id, data);
};

export const getChannel = (id: string) => {
  return get(prefix + "/" + id);
};


export const disable = (id: string) => {
  return put(prefix + "/disable/" + id);
}

export const test = (id: string) => {
  return put(prefix + "/test/" + id);
}

export const controlAutomatically = (id: string) => {
  return put(prefix + "/control-automatically/" + id);
}

export const UpdateOrder = (id: string, order: number) => {
  return put(prefix + "/order/" + id + "?order=" + order);
}