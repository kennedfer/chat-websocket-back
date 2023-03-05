## Chat Websocket Backend
### Esse repositorio faz parte de um projeto multirepo e, como devem ter visto, esse é do backend.
O ponto mais importante é que optei por não usar bibliotecas mais robustas (como a [socket.io](https://socket.io/) por exemplo) pois,<br>
por mais que sistemas importantissimos em um server de chat, como 'id de usuario' (para mensagens privadas) e sistema de 'rooms', <br>
**a parte divertida do desenvolvimento seria justamente codar esses sistemas.**<br>
<br>
Dito isso, sobre o(s) código e/ou sistemas:
as rooms são armazenadas em um objeto 'rooms' e elas funcionam de maneira bem simples.<br>
Cada room tem um id aleatório de quatro letras e ela, de maneira bem simplificada, é um array<br>
de sockets, sendo eles, os usuários/clientes da room;<br>
algo parecido com isso:
``` 
rooms={
  "abcd":[
    socket0,
    socket1,
    socket2
  ]
}
```
e, para o envio das mensagens, usa-se um forEach:<br>
```
rooms[roomId].forEach(clientSocket => clientSocket.send(message))
```
ps: lembre-se de dar um 'stringfy' nas mensagens caso seja um object

<br>

## createRoom
enfim, para criar um nova sala usamos uma lógica simplista novamente:
atribuimos um novo item ao objeto 'rooms' e adicionamos o socket do client ao array de clientes da sala;
```
const roomId = genRandomId();
rooms[roomId] = [clientSocket];
```
apartir disso temos uma nova sala com o client já incluso

<br>

## joinRoom
Bom, tudo aqui é feito de maneira simples e sim, simples é muito diferente de ruim, nosso trabalho é descomplicar e não o inverso<br>
Primeiro deve-se ter certeza de que a sala com aquele id existe<br><br>
se sim, ele executa joinRoom()<br>
se não, ele envia um objeto com propriedade 'error'<br><br>
no front esse 'error' é verificado para sabermos se tudo ocorreu de maneira correta,<br>
enfim, o 'join' real é um simples push no array/room daquele id:
```
if(roomDontExists()) return clientSocket.send({error:"sala nao encontrada"});
rooms[roomId].push(clientSocket);
```
<br>

## leaveRoom
Aqui a lógica pode ser vista como uma casa (ou uma sala rs) partindo do pressuposto de que:<br>
você só pode sair da casa se você estiver nela<br>
É feito um filtro na sala e removemos o socket do cliente do array:
```
rooms[roomId] = rooms[roomId].filter(roomSocket => roomSocket != clientSocket);
```
Também e feita uma verificação para, caso a sala esteja vazia, a fecha-la;

<br>

## closeRoom
Aqui é deletar a propriedade do objeto baseado no id passado.
```
delete rooms[roomId]
```
<br>

## Alguns pontos relevantes:
- os 'eventos' podem ser do tipo 'create, join, leave e message' sendo eles usados para suas respectivas funções<br>
(com exceção dos que tem verificações que servem como 'middlewares')

- Apesar da simplicidade essa é sim uma solução funcional
- Esse não é (e nem foi pensado para ser) uma super solução de chat online mas é um bom começo
- E, claro, isso tudo foi só um resumo e vários pontos estão diferentes do codigo real<br>
pois eu tenho uma ou outra função auxiliar no meio do caminho,<br>
a ideia foi passada mas caso tenha algum trecho que 'passou batido' o código completo está disponivel
