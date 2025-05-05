import { variables } from "@minecraft/server-admin"
import { HttpRequest, HttpHeader, HttpRequestMethod, http } from '@minecraft/server-net'

/*
 please don't delete this
 License: MIT
 Author: Aristotel and Cole 
 telegram: @AristotelDeco; github: https://github.com/colemad
*/

const SUPABASE_URL = variables.get("url")
const SUPABASE_KEY = variables.get("key")

async function db_req(uri, method, body = null) {
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
    return resp
  } catch (error) {
    console.error("Request error:", error)
    return null
  }
}

export default class Database_web {
  constructor(table) {
    this.table = table
  }
  async recEx(id) {
    const resp = await this.get(id)
    return resp && resp.status === 200 && resp.body !== "[]"
  }
  async set(data) {
    if (await this.recEx(data.id)) {
      console.error("ID does already exist")
      return 
    }
    if (!data.id) {
      console.error("data-err", data)
      return
    }
    await db_req(`${SUPABASE_URL}/${this.table}`, HttpRequestMethod.Post, data)
  }
  async repl(data) {
    if (data.id == null && await !this.recEx(data.id)) {
      console.error("ID does not exist")
      return
    }
    const query = data.id ? `${data.id}` : "*"
    await db_req(`${SUPABASE_URL}/${this.table}?id=eq.${query}`, HttpRequestMethod.Put, data)
  }
  async get(id = null) {
    const query = id ? `${id}` : "*"
    return await db_req(`${SUPABASE_URL}/${this.table}?id=eq.${query}`, HttpRequestMethod.Get)
  }
  async del(id = null) {
    if (id == null && await !this.recEx(id)) {
      console.error("ID does not exist")
      return 
    }
    const query = id ? `${id}` : "*"
    await db_req(`${SUPABASE_URL}/${this.table}?id=eq.${query}`, HttpRequestMethod.Delete)
  }
}