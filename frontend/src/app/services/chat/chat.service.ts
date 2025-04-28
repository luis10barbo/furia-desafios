import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BACKEND } from '../../constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {

  constructor(private httpClient: HttpClient) {}

  public async queryChat(query: string) {
    const response = await fetch(`${BACKEND}/chat/send?query=${query}`, {
      method: 'GET',
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
