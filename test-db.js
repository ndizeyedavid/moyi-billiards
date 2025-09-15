const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Test product creation
    const testProduct = {
      name: 'Test Pool Table',
      description: 'A test product for database verification',
      price: 1000,
      currency: 'RWF',
      category: 'Professional',
      status: 'Active',
      featured: false,
      stock: 5,
      images: ['https://res.cloudinary.com/duuqywafn/image/upload/v1/products/test.jpg'],
      slug: 'test-pool-table'
    };
    
    console.log('Creating test product...');
    const product = await prisma.product.create({
      data: testProduct
    });
    
    console.log('✅ Product created successfully:', product.id);
    
    // Clean up - delete the test product
    await prisma.product.delete({
      where: { id: product.id }
    });
    
    console.log('✅ Test product cleaned up');
    console.log('🎉 All tests passed! Database is working correctly.');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
