# Cashly - Point of Sales (POS) Cafe System Documentation API

**Cashly** adalah aplikasi sistem kasir (Point of Sales) yang dirancang untuk manajemen kafe. Dibangun menggunakan **Express.js**, **Prisma ORM**, dan **MySQL**, aplikasi ini mendukung fitur manajemen produk, kategori, pengaturan toko (termasuk logo & QRIS), serta sistem transaksi yang aman dengan perhitungan harga sisi server (*server-side calculation*).

## Fitur Utama
* **Multi-Role Auth**: Sistem login untuk Admin dan Kasir menggunakan JWT & Token Blacklisting.
* **Transaction Security**: Validasi harga produk langsung dari database untuk mencegah manipulasi harga dari frontend.
* **Dashboard Analytics**: Statistik cerdas yang berbeda untuk Admin (pendapatan total) dan Kasir (pencapaian individu).
* **File Management**: Upload logo perusahaan dan gambar QRIS untuk pembayaran.
* **Automated Testing**: Dilengkapi dengan Unit Testing menggunakan Jest & Supertest.

## Persyaratan Sistem
- **Node.js** (v18 ke atas)
- **MySQL**
- **NPM** atau **Yarn**

---
## Tutorial Instalasi
### Clone the Repository
```bash
git clone https://github.com/rzkibhtrafnd/cashlyExpressJS.git
cd cashlyExpressJS
```

### Install PHP Dependencies
```bash
npm install
```

### Konfigurasi Environment
Buat file .env di root direktori dan sesuaikan konfigurasinya:
```bash
DATABASE_URL="mysql://user:password@localhost:3306/cashly"
JWT_SECRET="rahasia_super_kuat_anda"
PORT=3000
```

### Setup Database (Prisma)
Jalankan migrasi untuk membuat tabel di database MySQL Anda:
```bash
npx prisma migrate dev --name init_database
```

### Jalankan Aplikasi
```bash
# Mode Development
npm run dev

# Mode Production
npm start
```
---
## API Endpoints

### Auth Controller

#### Register
**Request:**
```
URL: /api/register
Method: POST
Body:
{
    "name": "kasir3",
    "email": "kasir3@mail.com",
    "password": "password123",
    "role": "kasir"
}
```

**Response (Success - 201):**
```json
{
    "status": true,
    "message": "User berhasil didaftarkan",
    "data": {
        "id": 7,
        "name": "kasir3",
        "email": "kasir3@mail.com",
        "role": "kasir",
        "createdAt": "2026-05-12T13:37:48.572Z",
        "updatedAt": "2026-05-12T13:37:48.572Z"
    }
}
```

#### Login 
**Request:**
```
URL: /api/login
Method: POST
Body:
{
    "email": "admin@mail.com",
    "password": "password123"
}
```

**Response (Success - 200):**
```json
{
    "status": true,
    "message": "Login berhasil",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6I
    "user": {
        "id": 1,
        "name": "admin",
        "role": "admin"
    }
}
```

#### Logout
**Request:**
```
URL: /api/logout
Method: POST
Authorization: Bearer_Token 2|Xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Response (Success - 200):**
```json
{
    "status": true,
    "message": "Logout berhasil. Akses dengan token ini telah ditutup dari server."
}
```

### Admin Menu
### Setting
#### Index
**Request:**
```
URL: /api/settings
Method: GET
Authorization: Bearer 2|Xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Response (Success - 200):**
```json
{
    "status": true,
    "message": "Data pengaturan berhasil diambil",
    "data": {
        "id": 1,
        "companyName": "Kedai Kopi Cashly",
        "email": "cashly@admin.com",
        "phone": "0851565646779",
        "address": "Jl. Sudirman No. 1",
        "wifi": "CafeCashly_5G",
        "wifiPassword": "password",
        "imgLogo": "1778558400062.png",
        "imgQris": "1778558400064.jpg",
        "createdAt": "2026-05-10T06:06:44.232Z",
        "updatedAt": "2026-05-12T04:00:00.067Z"
    }
}
```

#### Update
**Request:**
```
URL: /api/settings
Method: POST
Authorization: Bearer 2|Xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Form-data:
companyName: Kedai Kopi Cashly
email: cashly@admin.com
phone: 084654654848
address: Jl. Sudirman No. 1
wifi: CafeCashly_5G
wifiPassword: password
imgLogo: File()
imgQris: File()
```

**Response (Success - 200):**
```json
{
    "status": true,
    "message": "Pengaturan berhasil disimpan",
    "data": {
        "id": 1,
        "companyName": "Kedai Kopi Cashly",
        "email": "cashly@admin.com",
        "phone": "0851565646779",
        "address": "Jl. Sudirman No. 1",
        "wifi": "CafeCashly_5G",
        "wifiPassword": "password",
        "imgLogo": "1778593493649.png",
        "imgQris": "1778593493651.jpg",
        "createdAt": "2026-05-10T06:06:44.232Z",
        "updatedAt": "2026-05-12T13:44:53.654Z"
    }
}
```

### User
#### Index
**Request:**
```
URL: /api/users
Method: GET
Authorization: Bearer 2|Xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Response (Success - 200):**
```json
{
    "status": true,
    "message": "Daftar pengguna berhasil diambil",
    "data": [
        {
            "id": 7,
            "name": "kasir3",
            "email": "kasir3@mail.com",
            "role": "kasir",
            "createdAt": "2026-05-12T13:37:48.572Z",
            "updatedAt": "2026-05-12T13:37:48.572Z"
        },
        {
            "id": 5,
            "name": "admin2",
            "email": "admin2@cashly.com",
            "role": "admin",
            "createdAt": "2026-05-09T06:22:19.822Z",
            "updatedAt": "2026-05-09T06:26:12.543Z"
        }
    ]
}
```

#### Create
**Request:**
```
URL: /api/users
Method: POST
Authorization: Bearer 2|Xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Body:
{
    "name": "admin4",
    "email": "admin4@cashly.com",
    "password": "password123",
    "role": "admin"
}

```

**Response (Success - 201):**
```json
{
    "status": true,
    "message": "Pengguna berhasil ditambahkan",
    "data": {
        "id": 8,
        "name": "admin4",
        "email": "admin4@cashly.com",
        "role": "admin",
        "createdAt": "2026-05-12T13:55:48.044Z",
        "updatedAt": "2026-05-12T13:55:48.044Z"
    }
}
```

#### Update
**Request:**
```
URL: /api/users/ID
Method: PUT
Authorization: Bearer 2|Xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Body:
{
    "name": "admin45",
    "email": "admin45@cashly.com",
    "password": "password123",
    "role": "admin"
}

```

**Response (Success - 200):**
```json
{
    "status": true,
    "message": "Pengguna berhasil diperbarui",
    "data": {
        "id": 8,
        "name": "admin45",
        "email": "admin45@cashly.com",
        "role": "admin",
        "createdAt": "2026-05-12T13:55:48.044Z",
        "updatedAt": "2026-05-12T13:56:24.438Z"
    }
}
```

#### Show
**Request:**
```
URL: /api/users/ID
Method: GET
Authorization: Bearer 2|Xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Response (Success - 200):**
```json
{
    "status": true,
    "message": "Detail pengguna berhasil diambil",
    "data": {
        "id": 8,
        "name": "admin45",
        "email": "admin45@cashly.com",
        "role": "admin",
        "createdAt": "2026-05-12T13:55:48.044Z",
        "updatedAt": "2026-05-12T13:56:24.438Z"
    }
}
```

#### Delete
**Request:**
```
URL: /api/users/ID
Method: DELETE
Authorization: Bearer 2|Xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Response (Success - 200):**
```json
{
    "status": true,
    "message": "Pengguna berhasil dihapus"
}
```

### Category
#### Index
**Request:**
```
URL: /api/categories
Method: GET
Authorization: Bearer 2|Xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Response (Success - 200):**
```json
{
    "status": true,
    "message": "Daftar kategori berhasil diambil",
    "data": [
        {
            "id": 6,
            "name": "Minuman",
            "createdAt": "2026-05-10T06:23:59.802Z",
            "updatedAt": "2026-05-10T06:23:59.802Z"
        },
        {
            "id": 5,
            "name": "Makanan",
            "createdAt": "2026-05-08T14:33:04.723Z",
            "updatedAt": "2026-05-08T14:33:04.723Z"
        }
    ]
}
```

#### Create
**Request:**
```
URL: /api/categories
Method: POST
Authorization: Bearer 2|Xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Body:
{
    "name": "Snack"
}
```

**Response (Success - 201):**
```json
{
    "status": true,
    "message": "Kategori berhasil ditambahkan",
    "data": {
        "id": 7,
        "name": "Snack",
        "createdAt": "2026-05-12T13:48:05.135Z",
        "updatedAt": "2026-05-12T13:48:05.135Z"
    }
}
```

#### Update
**Request:**
```
URL: /api/categories/ID
Method: PUT
Authorization: Bearer 2|Xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Body:
{
    "name": "Snack Kering"
}
```

**Response (Success - 200):**
```json
{
    "status": true,
    "message": "Kategori berhasil diperbarui",
    "data": {
        "id": 7,
        "name": "Snack Kering",
        "createdAt": "2026-05-12T13:48:05.135Z",
        "updatedAt": "2026-05-12T13:50:26.007Z"
    }
}
```

#### Delete
**Request:**
```
URL: /api/categories/ID
Method: DELETE
Authorization: Bearer 2|Xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Response (Success - 200):**
```json
{
    "status": true,
    "message": "Kategori berhasil dihapus"
}
```


## Use Cases

### User Flow
1. User registers or logs in to get an authentication token
2. User browses available properties (can filter by city, type, etc.)
3. User views details of a specific property
4. User views available rooms in the property
5. User checks availability and pricing of a specific room
6. User makes a booking by providing personal information
7. User uploads payment proof
8. User can view their booking history and payment status

### Owner Flow
1. Owner logs in to get an authentication token
2. Owner creates or updates their property listings
3. Owner manages rooms within their properties
4. Owner sets availability and pricing for rooms
5. Owner views bookings made for their properties
6. Owner processes payments and updates payment status

### Admin Flow
1. Admin manages owner accounts
2. Admin can create, update, or delete owner accounts

## Error Handling
The API returns appropriate HTTP status codes along with error messages:

- 200 OK: The request was successful
- 201 Created: A new resource was successfully created
- 400 Bad Request: The request contains invalid parameters
- 401 Unauthorized: Authentication is required or credentials are invalid
- 403 Forbidden: The authenticated user doesn't have permission to access the resource
- 404 Not Found: The requested resource doesn't exist
- 422 Unprocessable Entity: The request data was invalid
- 500 Internal Server Error: An error occurred on the server
