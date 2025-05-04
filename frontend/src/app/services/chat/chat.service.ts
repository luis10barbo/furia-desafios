import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export type Message = {message:string, role: "user" | "assistant", id: string}

@Injectable({
  providedIn: 'root',
})
export class ChatService {

  constructor(private httpClient: HttpClient) {}

  public async queryChat(query: string, messageHistory: Message[]) {
    const response = await fetch(`${environment.BACKEND}/chat/send?query=${query}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(messageHistory)
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    const observable = new Observable<string>((sub) => {
      (async () => {
        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
      
            if (done) {
              console.log('Stream finished.');
              break;
            }
      
            const chunk = decoder.decode(value, { stream: true });
            // console.log('Received chunk:', chunk);
            sub.next(chunk);
            // Here you can do whatever you want with `chunk`
          }
        }
      })();
    })
    
    return observable
  }
}
