const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {

    //For testing purposes, delete users and preferences
    await prisma.users.deleteMany({});
    await prisma.preferences.deleteMany({});
    
  // Create multiple users
  const users = await Promise.all([ //Promise.all lets us create multiple user records simultaneously
    prisma.user.create({
      data: {
        email: 'Alice@TravelPlanner.com',
        password: 'TravelPlannerTest1',
      },
    }),
    prisma.user.create({
      data: {
        email: 'Bob@TravelPlanner.com',
        password: 'TravelPlannerTest2',
      },
    }),
    prisma.user.create({
        data: {
          email: 'Jack@TravelPlanner.com',
          password: 'TravelPlannerTest3',
        },
      }),
      prisma.user.create({
        data: {
          email: 'Barbara@TravelPlanner.com',
          password: 'TravelPlannerTest4',
        },
      }),
  ]);

  // Create preferences and routes for each user
  for (const user of users) {
    //preferences
    await prisma.preferences.create({
      data: {
        budget: 25,
        safetyPriority: 2,
        speedPriority: 1,
        userId: user.id, // Connect preferences to the user
      },
    });
  

  //routes
  await prisma.route.create({
    data: {
      start: `Location ${user.id}`,         //Testing specific location per user
      end: `Destination ${user.id}`,        //Testing specific destination per user
      cost: 20 + user.id,                   //Testing different cost per user
      estimatedTime: new Date(),            
      details: `Details for route A to B for user ${user.id}`,
    },
  });
}
  console.log('Seeding finished.');
}

main()
  //Error handling
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });