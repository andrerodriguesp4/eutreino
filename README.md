# Aplicativo de Gerenciamento de Treinos React Native

Este aplicativo React Native permite que usuários gerenciem seus treinos e exercícios de forma prática e eficiente. Utilizando Firebase Firestore como backend, o app oferece funcionalidades para visualização, edição e acompanhamento dos treinos e seus detalhes.

## Funcionalidades

- Autenticação simples via armazenamento local (AsyncStorage).
- Listagem de treinos do usuário.
- Visualização detalhada dos exercícios dentro de cada treino.
- Edição dos detalhes dos exercícios, incluindo:
  - Nome do exercício
  - Número de séries
  - Repetições
  - Carga e descanso (pré-configurado para futuras edições)
- Modais interativos para alterar informações dos treinos e exercícios.
- Armazenamento e sincronização de dados em tempo real com Firestore.

## Tecnologias Utilizadas

- React Native
- Firebase Firestore
- AsyncStorage
- Expo Vector Icons
- React Native Picker

## Instalação e Configuração
```bash
1. Clone este repositório:

git clone <url-do-repositorio>
cd <nome-do-projeto>

2. Instale as dependências:
npm install

3. Execute o aplicativo:
expo start

Ou pelo React Native CLI:
npx react-native run-android
# ou
npx react-native run-ios
