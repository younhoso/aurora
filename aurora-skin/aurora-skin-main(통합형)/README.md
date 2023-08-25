# 샵바이 리액트 오로라 스킨

## 로컬에서 개발 서버 올리기

### 개발 환경 설정

- [ ] [NodeJS](https://nodejs.org/ko/) : v16.10.0 이상
  - 노드버전관리자([nvm](https://github.com/nvm-sh/nvm))를 사용하는 것을 추천한다.
- [ ] 패키지 매니저 : [yarn](https://classic.yarnpkg.com/en/docs/install#mac-stable) (yarn 1) 또는 [npm](https://nodejs.org/en/)
- [ ] clientId 세팅: `public/environment.json` 에 부여받은 `clientId` 를 기입한다.

### 저장소 클론

```sh
$ git clone https://skins.shopby.co.kr/shopby/aurora-skin.git
```

> 계정정보와 비밀번호를 요구할 수 있다. 깃랩 저장소 권한에 필요한 정보를 입력해준다.
> <img width="840" alt="스크린샷 2023-03-05 오후 10 14 58" src="https://user-images.githubusercontent.com/43128697/222962726-23602985-a654-4ddf-a76e-5c7935b3eb67.png"> > <br>

- 소스코드가 정상적으로 클론되어 있는지 확인하고, 해당 프로젝트로 이동한다.

```sh
$ ls

$ cd aurora-skin
```

> nvm이 설치 되어 있다면 자동으로 노드 버전을 설정해 줄 것이다.
> <img width="840" alt="스크린샷 2023-03-05 오후 10 17 31" src="https://user-images.githubusercontent.com/43128697/222962817-09cde967-80bd-4695-ab49-f67c6c238f49.png">

### 의존성 설치

- 샵바이 스킨을 개발하기 위해 필요한 의존성을 설치한다.
- 패키지 매니저는 yarn classic (yarn 1)을 권장한다.
  - npm을 사용할 수는 있지만, npm 7버전 이상부터는 의존성 설치 시 peer dependencies가 맞지 않는 경우 설치가 막힌다.
  - → `--legacy-peer-deps` 옵션을 사용해주어야 한다.

```sh
$ yarn install

# npm 4 ~ 6 버전 사용 시
$ npm install

# npm 7 이상 사용 시
$ npm install --legacy-peer-deps
```

<img width="780" alt="스크린샷 2023-03-05 오후 10 20 24" src="https://user-images.githubusercontent.com/43128697/222962983-ded55357-33e4-4a67-9a98-45af9c9ef17f.png">

### 개발 서버 띄우기

정상적으로 설치했다면, 이제 로컬에서 개발 서버를 띄어보자!

```sh
$ yarn start
```

<img width="780" alt="aurora-skin-yarn-start" src="https://user-images.githubusercontent.com/43128697/222964085-3d01473a-778e-4d26-8528-7925f8da0878.png">

웹 브라우저를 열고 http://localhost:8081/ 로 접속해본다.

<img width="1440" alt="스크린샷 2023-03-05 오후 10 34 47" src="https://user-images.githubusercontent.com/43128697/222963724-e671eec3-0a50-4aa0-84d8-872e4d2b3356.png">

## 빌드하기

소스코드를 작성하고 배포하기위해 빌드해보자.

```sh
$ yarn build
```

<img width="1064" alt="스크린샷 2023-03-05 오후 11 05 08" src="https://user-images.githubusercontent.com/43128697/222965316-51aff0f1-e881-49b6-a6a7-f0ad7bb4a0af.png">

> 빌드한 결과물은 `/dist` 디렉토리에 존재한다.

## 최신 릴리즈 버전 패치하기

`remote`에 `upstream`으로 오로라 저장소를 추가한다.

```sh
$ git remote add upstream https://skins.shopby.co.kr/shopby/aurora-skin.git
```

`main`을 패치한다.

```sh
$ git fetch upstream main
$ git merge upstream/main --allow-unrelated-histories
```

패치받은 버전을 병합하면 충돌이 발생할 수 있다.
충돌 해결 후 개발 저장소에 `commit & push` 한다.
