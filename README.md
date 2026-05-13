# Cashly - Point of Sales (POS) Cafe System Documentation API

**Cashly** adalah aplikasi sistem kasir (Point of Sales) yang dirancang untuk manajemen kafe. Dibangun menggunakan **Express.js**, **Prisma ORM**, dan **MySQL**, aplikasi ini mendukung fitur manajemen produk, kategori, pengaturan toko (termasuk logo & QRIS), serta sistem transaksi yang aman dengan perhitungan harga sisi server (*server-side calculation*).

## Fitur Utama
* **Multi-Role Auth**: Sistem login untuk Admin dan Kasir menggunakan JWT & Token Blacklisting.
* **Transaction Security**: Validasi harga produk langsung dari database untuk mencegah manipulasi harga dari frontend.
* **Dashboard Analytics**: Statistik cerdas yang berbeda untuk Admin (pendapatan total) dan Kasir (pencapaian individu).
* **File Management**: Upload logo perusahaan dan gambar QRIS untuk pembayaran.

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
## Alur Pengguna (Flow)

### Admin Flow
1. Autentikasi: Admin melakukan login untuk mendapatkan JWT Token.
2. Manajemen Pengguna: Admin dapat membuat, melihat, memperbarui, atau menghapus akun Kasir.
3. Konfigurasi Toko: Admin mengatur identitas kafe (Nama, Alamat, WiFi, Logo, dan QRIS).
4. Manajemen Katalog: Admin mengelola kategori menu dan detail produk (termasuk upload gambar menu).
5. Monitoring Dashboard: Admin melihat statistik performa kafe secara keseluruhan (total pendapatan, produk terlaris, dan jumlah transaksi).
6. Proses Transaksi:
   - Kasir memilih produk berdasarkan pesanan pelanggan (Input via Cart).
   - Memilih metode pembayaran (Cash/QRIS).
   - Sistem menghitung total secara otomatis di sisi server.
7. Riwayat Penjualan: Admin dapat melihat daftar semua transaksi.
8. Laporan: Admin dapat menarik laporan transaksi berdasarkan rentang waktu tertentu.

### Kasir Flow
1. Autentikasi: Kasir login ke sistem.
2. Dashboard Individu: Kasir melihat ringkasan penjualan yang mereka lakukan sendiri pada hari tersebut.
3. Proses Transaksi:
   - Kasir memilih produk berdasarkan pesanan pelanggan (Input via Cart).
   - Memilih metode pembayaran (Cash/QRIS).
   - Sistem menghitung total secara otomatis di sisi server.
7. Riwayat Penjualan: Kasir dapat melihat daftar transaksi yang pernah mereka tangani.
 H
## Penanganan Error (Error Handling)
API mengembalikan kode status HTTP standar untuk menunjukkan keberhasilan atau kegagalan permintaan:

- 200 OK: Permintaan berhasil diproses.
- 201 Created: Sumber daya baru (User/Produk/Transaksi) berhasil dibuat.
- 400 Bad Request: Permintaan tidak valid (input field kosong atau format salah).
- 401 Unauthorized: Token JWT tidak valid, kedaluwarsa, atau sudah di-blacklist (logout).
- 403 Forbidden: Kasir mencoba mengakses menu Admin (seperti manajemen user).
- 404 Not Found: Data (Produk/User/Transaksi) tidak ditemukan di database.
- 500 Internal Server Error: Terjadi kesalahan pada logika server atau database.
---

## API Endpoints

### Auth Controller
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
#### Dashboard
**Request:**
```
URL: /api/dashboard
Method: GET
Authorization: Bearer 2|Xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Response (Success - 200):**
```json
{
    "status": true,
    "message": "Data dashboard berhasil diambil",
    "role": "admin",
    "data": {
        "categoriesCount": 3,
        "productsCount": 2,
        "transactionsCount": 2,
        "totalRevenue": 85000,
        "recentTransactions": [
            {
                "id": 2,
                "userId": 1,
                "total": "47000",
                "paymentStatus": "paid",
                "createdAt": "2026-05-13T02:58:29.850Z",
                "user": {
                    "id": 1,
                    "name": "admin"
                }
            },
            {
                "id": 1,
                "userId": 1,
                "total": "38000",
                "paymentStatus": "paid",
                "createdAt": "2026-05-10T06:26:03.239Z",
                "user": {
                    "id": 1,
                    "name": "admin"
                }
            }
        ],
        "topProducts": [
            {
                "id": 2,
                "name": "Red Velvet",
                "totalSold": 4,
                "totalRevenue": 70000
            },
            {
                "id": 5,
                "name": "Es Teh",
                "totalSold": 1,
                "totalRevenue": 7000
            }
        ]
    }
}
```

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

### Product
#### Index
**Request:**
```
URL: /api/products
Method: GET
Authorization: Bearer 2|Xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Response (Success - 200):**
```json
{
    "status": true,
    "message": "Daftar produk berhasil diambil",
    "data": [
        {
            "id": 2,
            "name": "Nasi Goreng Spesial",
            "price": "15000",
            "image": "1778394894708.jpg",
            "createdAt": "2026-05-08T15:05:31.045Z",
            "updatedAt": "2026-05-10T06:35:03.074Z",
            "category": {
                "id": 5,
                "name": "Makanan"
            }
        }
    ]
}
```
#### Show
**Request:**
```
URL: /api/products/ID
Method: GET
Authorization: Bearer 2|Xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Response (Success - 200):**
```json
{
    "status": true,
    "message": "Detail produk berhasil diambil",
    "data": {
        "id": 2,
        "name": "Red Velvet",
        "price": "20000",
        "image": "1778394894708.jpg",
        "createdAt": "2026-05-08T15:05:31.045Z",
        "updatedAt": "2026-05-13T02:53:30.420Z",
        "category": {
            "id": 8,
            "name": "Minuman"
        }
    }
}
```

#### Create
**Request:**
```
URL: /api/products
Method: POST
Authorization: Bearer 2|Xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Form-date:
categoryId: 8
name: Red Velvet Ice
price: 20000
image: File()
```

**Response (Success - 201):**
```json
{
    "status": true,
    "message": "Produk berhasil ditambahkan",
    "data": {
        "id": 4,
        "name": "Red Velvet Ice",
        "price": "20000",
        "image": "image-1778640759069-505090783.jpg",
        "createdAt": "2026-05-13T02:52:39.072Z",
        "updatedAt": "2026-05-13T02:52:39.072Z",
        "category": {
            "id": 8,
            "name": "Minuman"
        }
    }
}
```

#### Update
**Request:**
```
URL: /api/categories/ID
Method: PUT
Authorization: Bearer 2|Xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Form-date:
categoryId: 8
name: Red Velvet
price: 20000
image: File()
```
```

**Response (Success - 200):**
```json
{
    "status": true,
    "message": "Produk berhasil diperbarui",
    "data": {
        "id": 2,
        "name": "Red Velvet",
        "price": "20000",
        "image": "1778394894708.jpg",
        "createdAt": "2026-05-08T15:05:31.045Z",
        "updatedAt": "2026-05-13T02:53:30.420Z",
        "category": {
            "id": 8,
            "name": "Minuman"
        }
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
    "message": "Produk berhasil dihapus beserta gambarnya"
}
```

### Transaction
#### Index
**Request:**
```
URL: /api/transactions
Method: GET
Authorization: Bearer 2|Xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Response (Success - 200):**
```json
{
    "status": true,
    "message": "Data transaksi berhasil diambil",
    "data": [
        {
            "id": 1,
            "userId": 1,
            "total": "38000",
            "paymentMethod": "qris",
            "paymentStatus": "paid",
            "createdAt": "2026-05-10T06:26:03.239Z",
            "user": {
                "id": 1,
                "name": "admin"
            }
        }
    ],
    "meta": {
        "page": 1,
        "limit": 10,
        "totalItems": 1,
        "totalPages": 1
    }
}
```
#### Report
**Request:**
```
URL: /api/transactions/report
Method: GET
Authorization: Bearer 2|Xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Response (Success - 200):**
```json
{
    "status": true,
    "message": "Laporan transaksi berhasil diambil",
    "data": [
        {
            "id": 2,
            "userId": 1,
            "total": "47000",
            "paymentMethod": "qris",
            "paymentStatus": "paid",
            "createdAt": "2026-05-13T02:58:29.850Z",
            "updatedAt": "2026-05-13T02:58:29.850Z",
            "user": {
                "id": 1,
                "name": "admin"
            }
        },
        {
            "id": 1,
            "userId": 1,
            "total": "38000",
            "paymentMethod": "qris",
            "paymentStatus": "paid",
            "createdAt": "2026-05-10T06:26:03.239Z",
            "updatedAt": "2026-05-10T06:26:03.239Z",
            "user": {
                "id": 1,
                "name": "admin"
            }
        }
    ]
}
```

#### Show
**Request:**
```
URL: /api/tranactions/ID
Method: GET
Authorization: Bearer 2|Xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Response (Success - 200):**
```json
{
    "status": true,
    "message": "Detail transaksi berhasil diambil",
    "data": {
        "id": 2,
        "userId": 1,
        "total": "47000",
        "paymentMethod": "qris",
        "paymentStatus": "paid",
        "createdAt": "2026-05-13T02:58:29.850Z",
        "updatedAt": "2026-05-13T02:58:29.850Z",
        "user": {
            "id": 1,
            "name": "admin"
        },
        "items": [
            {
                "id": 3,
                "transactionId": 2,
                "productId": 2,
                "qty": 2,
                "price": "20000",
                "subtotal": "40000",
                "createdAt": "2026-05-13T02:58:29.850Z",
                "updatedAt": "2026-05-13T02:58:29.850Z",
                "product": {
                    "id": 2,
                    "name": "Red Velvet",
                    "price": "20000"
                }
            },
            {
                "id": 4,
                "transactionId": 2,
                "productId": 5,
                "qty": 1,
                "price": "7000",
                "subtotal": "7000",
                "createdAt": "2026-05-13T02:58:29.850Z",
                "updatedAt": "2026-05-13T02:58:29.850Z",
                "product": {
                    "id": 5,
                    "name": "Es Teh",
                    "price": "7000"
                }
            }
        ]
    }
}
```

#### Create
**Request:**
```
URL: /api/transactions
Method: POST
Authorization: Bearer 2|Xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Body:
{
    "paymentMethod": "qris",
    "cart": [
        {
            "id": 2,
            "qty": 2
        },
        {
            "id": 5,
            "qty": 1
        }
    ]
}
```

**Response (Success - 201):**
```json
{
    "status": true,
    "message": "Transaksi berhasil disimpan",
    "data": {
        "id": 2,
        "userId": 1,
        "total": "47000",
        "paymentMethod": "qris",
        "paymentStatus": "paid",
        "createdAt": "2026-05-13T02:58:29.850Z",
        "updatedAt": "2026-05-13T02:58:29.850Z",
        "items": [
            {
                "id": 3,
                "transactionId": 2,
                "productId": 2,
                "qty": 2,
                "price": "20000",
                "subtotal": "40000",
                "createdAt": "2026-05-13T02:58:29.850Z",
                "updatedAt": "2026-05-13T02:58:29.850Z"
            },
            {
                "id": 4,
                "transactionId": 2,
                "productId": 5,
                "qty": 1,
                "price": "7000",
                "subtotal": "7000",
                "createdAt": "2026-05-13T02:58:29.850Z",
                "updatedAt": "2026-05-13T02:58:29.850Z"
            }
        ]
    }
}
```

### Kasir Menu
#### Dashboard
**Request:**
```
URL: /api/dashboard
Method: GET
Authorization: Bearer 2|Xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Response (Success - 200):**
```json
{
    "status": true,
    "message": "Data dashboard berhasil diambil",
    "role": "kasir",
    "data": {
        "myTransactionsCount": 1,
        "myRevenue": 47000,
        "myRecentTransactions": [
            {
                "id": 3,
                "total": "47000",
                "paymentStatus": "paid",
                "createdAt": "2026-05-13T03:03:55.420Z"
            }
        ]
    }
}
```

### Product
#### Index
**Request:**
```
URL: /api/products
Method: GET
Authorization: Bearer 2|Xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Response (Success - 200):**
```json
{
    "status": true,
    "message": "Daftar produk berhasil diambil",
    "data": [
        {
            "id": 2,
            "name": "Nasi Goreng Spesial",
            "price": "15000",
            "image": "1778394894708.jpg",
            "createdAt": "2026-05-08T15:05:31.045Z",
            "updatedAt": "2026-05-10T06:35:03.074Z",
            "category": {
                "id": 5,
                "name": "Makanan"
            }
        }
    ]
}
```
#### Show
**Request:**
```
URL: /api/products/ID
Method: GET
Authorization: Bearer 2|Xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Response (Success - 200):**
```json
{
    "status": true,
    "message": "Detail produk berhasil diambil",
    "data": {
        "id": 2,
        "name": "Red Velvet",
        "price": "20000",
        "image": "1778394894708.jpg",
        "createdAt": "2026-05-08T15:05:31.045Z",
        "updatedAt": "2026-05-13T02:53:30.420Z",
        "category": {
            "id": 8,
            "name": "Minuman"
        }
    }
}
```
### Transaction
#### Index
**Request:**
```
URL: /api/transactions
Method: GET
Authorization: Bearer 2|Xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Response (Success - 200):**
```json
{
    "status": true,
    "message": "Data transaksi berhasil diambil",
    "data": [
        {
            "id": 1,
            "userId": 1,
            "total": "38000",
            "paymentMethod": "qris",
            "paymentStatus": "paid",
            "createdAt": "2026-05-10T06:26:03.239Z",
            "user": {
                "id": 1,
                "name": "admin"
            }
        }
    ],
    "meta": {
        "page": 1,
        "limit": 10,
        "totalItems": 1,
        "totalPages": 1
    }
}
```

#### Show
**Request:**
```
URL: /api/tranactions/ID
Method: GET
Authorization: Bearer 2|Xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Response (Success - 200):**
```json
{
    "status": true,
    "message": "Detail transaksi berhasil diambil",
    "data": {
        "id": 2,
        "userId": 1,
        "total": "47000",
        "paymentMethod": "qris",
        "paymentStatus": "paid",
        "createdAt": "2026-05-13T02:58:29.850Z",
        "updatedAt": "2026-05-13T02:58:29.850Z",
        "user": {
            "id": 1,
            "name": "admin"
        },
        "items": [
            {
                "id": 3,
                "transactionId": 2,
                "productId": 2,
                "qty": 2,
                "price": "20000",
                "subtotal": "40000",
                "createdAt": "2026-05-13T02:58:29.850Z",
                "updatedAt": "2026-05-13T02:58:29.850Z",
                "product": {
                    "id": 2,
                    "name": "Red Velvet",
                    "price": "20000"
                }
            },
            {
                "id": 4,
                "transactionId": 2,
                "productId": 5,
                "qty": 1,
                "price": "7000",
                "subtotal": "7000",
                "createdAt": "2026-05-13T02:58:29.850Z",
                "updatedAt": "2026-05-13T02:58:29.850Z",
                "product": {
                    "id": 5,
                    "name": "Es Teh",
                    "price": "7000"
                }
            }
        ]
    }
}
```

#### Create
**Request:**
```
URL: /api/transactions
Method: POST
Authorization: Bearer 2|Xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Body:
{
    "paymentMethod": "qris",
    "cart": [
        {
            "id": 2,
            "qty": 2
        },
        {
            "id": 5,
            "qty": 1
        }
    ]
}
```

**Response (Success - 201):**
```json
{
    "status": true,
    "message": "Transaksi berhasil disimpan",
    "data": {
        "id": 2,
        "userId": 1,
        "total": "47000",
        "paymentMethod": "qris",
        "paymentStatus": "paid",
        "createdAt": "2026-05-13T02:58:29.850Z",
        "updatedAt": "2026-05-13T02:58:29.850Z",
        "items": [
            {
                "id": 3,
                "transactionId": 2,
                "productId": 2,
                "qty": 2,
                "price": "20000",
                "subtotal": "40000",
                "createdAt": "2026-05-13T02:58:29.850Z",
                "updatedAt": "2026-05-13T02:58:29.850Z"
            },
            {
                "id": 4,
                "transactionId": 2,
                "productId": 5,
                "qty": 1,
                "price": "7000",
                "subtotal": "7000",
                "createdAt": "2026-05-13T02:58:29.850Z",
                "updatedAt": "2026-05-13T02:58:29.850Z"
            }
        ]
    }
}
```
