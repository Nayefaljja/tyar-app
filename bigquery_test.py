import psycopg2

def expand_schema():
    try:
        conn = psycopg2.connect(
            host="127.0.0.1", port=5433,
            database="ashia_backend_prod",
            user="postgres", password="123654"
        )
        cur = conn.cursor()

        # 1. Create the Orders table
        print("Building 'orders' table...")
        cur.execute("""
            CREATE TABLE IF NOT EXISTS orders (
                order_id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(user_id), -- This links to your Users table
                item_name VARCHAR(255) NOT NULL,
                amount DECIMAL(10, 2),
                status VARCHAR(50) DEFAULT 'pending',
                order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)

        # 2. Add an order for user #1 (Nayef)
        print("Assigning an order to Nayef...")
        cur.execute("""
            INSERT INTO orders (user_id, item_name, amount) 
            VALUES (1, 'Premium Delivery Service', 150.00);
        """)

        conn.commit()

        # 3. The "Magic" Query: Joining the tables
        print("\n--- Tyar App: Customer Order Report ---")
        cur.execute("""
            SELECT u.full_name, o.item_name, o.amount, o.status
            FROM users u
            JOIN orders o ON u.user_id = o.user_id;
        """)
        
        for row in cur.fetchall():
            print(f"Customer: {row[0]} | Item: {row[1]} | Price: {row[2]} SAR | Status: {row[3]}")

        cur.close()
        conn.close()

    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    expand_schema()