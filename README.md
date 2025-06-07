# Product Service Frontend

Next.js 기반의 Product Service 프론트엔드 애플리케이션입니다.

## 주요 기능

### 1. 사용자 관리 (User Service)
- **로그인/로그아웃**: `/user/login`, `/user/logout`
- **회원가입**: `/user/create`
- **로그인 상태 확인**: `/user/isLogin`

### 2. 상품 관리 (Product Service)
- **상품 목록 조회**: `/product/findProductPaging`
- **상품 상세 조회**: `/product/findProductById/{id}`

### 3. 장바구니 관리 (Cart Service)
- **장바구니 조회**: `/cart`
- **상품 추가**: `/cart/add`
- **수량 변경**: `/cart/items/{itemId}`
- **상품 삭제**: `/cart/items/{itemId}`
- **장바구니 비우기**: `/cart/clear`

### 4. 주문 관리 (Order Service)
- **주문 생성**: `/order/create`
- **주문 목록 조회**: `/order`
- **주문 상세 조회**: `/order/{orderId}`
- **주문 취소**: `/order/{orderId}/cancel`

### 5. 메시지 관리 (Message Service)
- **메시지 전송**: `/message/send`
- **받은 메시지 조회**: `/message/inbox`
- **보낸 메시지 조회**: `/message/sent`
- **메시지 상세 조회**: `/message/{messageId}`
- **메시지 읽음 처리**: `/message/{messageId}/read`

## 페이지 구조

```
/                    - 메인 페이지 (상품 목록 및 빠른 링크)
/login              - 로그인 페이지
/signup             - 회원가입 페이지
/products           - 상품 목록 페이지
/cart               - 장바구니 페이지
/orders             - 주문 내역 페이지
/messages           - 메시지 목록 페이지 (받은/보낸 메시지)
/messages/compose   - 메시지 작성 페이지
```

## API Gateway 설정

모든 API 요청은 `http://localhost:8070` (Gateway)를 통해 라우팅됩니다:

- User Service: `localhost:8080`
- Product Service: `localhost:8081`
- Cart Service: `localhost:8082`
- Order Service: `localhost:8083`
- Message Service: `localhost:8084`

## 서비스 구조

### Services (`/services`)
- `userService.ts` - 사용자 관련 API 호출
- `productService.ts` - 상품 관련 API 호출
- `cartService.ts` - 장바구니 관련 API 호출
- `orderService.ts` - 주문 관련 API 호출
- `messageService.ts` - 메시지 관련 API 호출

### Types (`/types`)
- `product.ts` - 상품 관련 타입 정의
- `cart.ts` - 장바구니 관련 타입 정의
- `order.ts` - 주문 관련 타입 정의
- `message.ts` - 메시지 관련 타입 정의

### Components (`/components`)
- `layout/` - 레이아웃 컴포넌트
- `product/` - 상품 관련 컴포넌트
- `login/` - 로그인 관련 컴포넌트
- `common/` - 공통 컴포넌트

## 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프로덕션 실행
npm start
```

## 주요 특징

1. **Gateway 기반 아키텍처**: 모든 API 요청이 단일 게이트웨이를 통해 라우팅
2. **인증 기반 접근**: JWT 토큰을 사용한 인증 시스템
3. **반응형 디자인**: Tailwind CSS를 사용한 모바일 친화적 UI
4. **타입 안전성**: TypeScript를 사용한 타입 안전한 개발
5. **컴포넌트 기반**: 재사용 가능한 컴포넌트 구조

## 환경 설정

Gateway URL은 각 서비스 파일에서 `http://localhost:8070`으로 설정되어 있습니다.
필요에 따라 환경 변수로 관리할 수 있습니다.
