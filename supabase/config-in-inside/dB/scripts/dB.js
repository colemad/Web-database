import { url, key } from "./config.js"
import { HttpRequest, HttpHeader, HttpRequestMethod, http } from '@minecraft/server-net'

/*
 please don't delete this
 License: MIT
 Author: Aristotel and Cole 
 telegram: @AristotelDeco; github: https://github.com/colemad
*/

const SUPABASE_URL = url
const SUPABASE_KEY = key

async function db_req(uri, method, body = null) {
  console.log("Requesting:", uri, method, body ? JSON.stringify(body) : "no-content")

  const req = new HttpRequest(uri)
  req.method = method
  if (body) req.body = JSON.stringify(body)
  req.headers = [
    new HttpHeader('Content-Type', 'application/json'),
    new HttpHeader('apikey', SUPABASE_KEY),
    new HttpHeader('Authorization', `Bearer ${SUPABASE_KEY}`),
    //new HttpHeader('Prefer', 'return=minimal') //optimization
  ]

  try {
    const resp = await http.request(req)
    console.log("Response:", resp?.status || "No status", resp?.body || "No body")
    return resp
  } catch (error) {
    console.log("Request error:", error)
    return null
  }
}

export class Database_web {
  constructor(table) {
    this.table = table
  }
  async recEx(id) {
    console.log("recEx")
    const resp = await this.get(id)
    return resp && resp.status === 200 && resp.body !== "[]"
  }
  async set(data) {
    console.log("set")
    if (await this.recEx(data.id)) {
      console.log("ID does already exist")
      return 
    }
    if (!data.id) {
      console.log("data-err", data)
      return
    }
    await db_req(`${SUPABASE_URL}/${this.table}`, HttpRequestMethod.Post, data)
  }
  async repl(data) {
    if (data.id == null) console.log(`id:${data.id}`)
    else if (await !this.recEx(data.id)) {
      console.log("ID does not exist")
      return
    }
    console.log("repl")
    const query = data.id ? `${data.id}` : "*"
    await db_req(`${SUPABASE_URL}/${this.table}?id=eq.${query}`, HttpRequestMethod.Put, data)
  }
  async get(id = null) {
    console.log("get")
    const query = id ? `${id}` : "*"
    return await db_req(`${SUPABASE_URL}/${this.table}?id=eq.${query}`, HttpRequestMethod.Get)
  }
  async del(id = null) {
    if (id == null) console.log(`id:${id}`)
    else if (await !this.recEx(id)) {
      console.log("ID does not exist")
      return 
    }
    console.log("del")
    const query = id ? `${id}` : "*"
    await db_req(`${SUPABASE_URL}/${this.table}?id=eq.${query}`, HttpRequestMethod.Delete)
  }
}