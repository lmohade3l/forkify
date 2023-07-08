import { TIMEOUT_SEC } from "./config";
import { async } from "regenerator-runtime";


const timeout = function (s) {
    return new Promise(function (_, reject) {
      setTimeout(function () {
        reject(new Error(`Request took too long! Timeout after ${s} second`));
      }, s * 1000);
    });
  };


export const get_json = async function (url) {
    try{
      const fetch_pro = fetch(url);
        const res = await Promise.race([fetch_pro , timeout(TIMEOUT_SEC)]);
        const data = await res.json();
        //using the error created by the api:
         if (!res.ok) throw new Error(data.message);

         return data.data;
    } catch(err) {throw err;}
};


export const send_json = async function (url , upload_data) {
  try{
      console.log(upload_data);
      const fetch_pro = fetch(url , {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify(upload_data),
      });
      const res = await Promise.race([fetch_pro , timeout(TIMEOUT_SEC)]);
      const data = await res.json();

      //using the error created by the api:
       if (!res.ok) throw new Error(data.message);

       return data.data;
  } catch(err) {throw err;}
};