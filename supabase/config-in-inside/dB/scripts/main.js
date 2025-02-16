import { system } from '@minecraft/server'
import { Database_web } from "./dB.js"

let db = new Database_web("log_table")
system.runTimeout(async () => {
  await db.set({"id": "telegram-creater", "data":[{"test": "telegram: @AristotelDeco"}]})
}, 200)
system.runTimeout(async () => {
  await db.repl({"id": "telegram-creater", "data":[{"test": "@AristotelDeco"}]})
}, 200)
system.runTimeout(async () => {
  await db.get("telegram-creater")
}, 200)

/* 
system.runTimeout(async () => {
   //may cause errors on some hostings, if you have such a case, write to me https://github.com/colemad/Web-db/issues/new/choose
   //await db.del()
}, 200) 
*/