import { system } from '@minecraft/server'
import dB_web from "./dB.js"

let dB = new dB_web("log_table")
system.runTimeout(async () => {
  await dB.set({"id": "telegram-creater", "data":[{"test": "telegram: @AristotelDeco"}]})
}, 200)
system.runTimeout(async () => {
  await dB.repl({"id": "telegram-creater", "data":[{"test": "@AristotelDeco"}]})
}, 200)
system.runTimeout(async () => {
  await dB.get("telegram-creater")
}, 200)

/* 
system.runTimeout(async () => {
   //may cause errors on some hostings, if you have such a case, write to me https://github.com/colemad/Web-dB/issues/new/choose
   //await dB.del()
}, 200) 
*/