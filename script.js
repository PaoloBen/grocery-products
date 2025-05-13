// Populate Products table with data from external API
async function populateProductsTable() {
    try {
        // FETCH PRODUCTS FROM API HERE
        const response = await fetch('https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json');
        if (!response.ok) throw new Error('Failed to fetch products');
        const products = await response.json();

        const checkRequest = new sql.Request();
        const checkQuery = 'SELECT COUNT(*) AS count FROM Products';
        const result = await checkRequest.query(checkQuery);
        
        if (result.recordset[0].count === 0) {
            for (const product of products) {
                const insertRequest = new sql.Request();
                const insertQuery = `
                    INSERT INTO Products (name, price, image, type)
                    VALUES (@name, @price, @image, @type)
                `;
                
                insertRequest.input('name', sql.NVarChar, product.name);
                insertRequest.input('price', sql.Decimal(10, 2), product.price);
                insertRequest.input('image', sql.NVarChar, product.image);
                insertRequest.input('type', sql.NVarChar, product.type);
                
                await insertRequest.query(insertQuery);
            }
            console.log('✅ Products table populated with', products.length, 'products');
        } else {
            console.log('ℹ️ Products table already has data, skipping insert');
        }
    } catch (err) {
        console.error('❌ Error populating Products table:', err);
    }
}
