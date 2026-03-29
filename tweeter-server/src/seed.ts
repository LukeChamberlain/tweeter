import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({ region: "us-east-1" }));

const followeeAlias = "@atomeve";

const fakeUsers = [
    { alias: "@markgrayson", firstName: "Mark", lastName: "Grayson", imageUrl: "https://static.wikia.nocookie.net/invincible/images/4/4b/Mark_Grayson.png" },
    { alias: "@nolangrayson", firstName: "Nolan", lastName: "Grayson", imageUrl: "https://static.wikia.nocookie.net/invincible/images/1/1b/Omni-Man.png" },
    { alias: "@amberbennet", firstName: "Amber", lastName: "Bennett", imageUrl: "https://static.wikia.nocookie.net/invincible/images/a/a0/Amber_Bennett.png" },
    { alias: "@williamconnor", firstName: "William", lastName: "Connor", imageUrl: "https://static.wikia.nocookie.net/invincible/images/5/5c/William_Clockwell.png" },
    { alias: "@rex", firstName: "Rex", lastName: "Splode", imageUrl: "https://static.wikia.nocookie.net/invincible/images/2/2e/Rex_Splode.png" },
    { alias: "@robotrudy", firstName: "Rudy", lastName: "Conners", imageUrl: "https://static.wikia.nocookie.net/invincible/images/3/3b/Robot.png" },
    { alias: "@monstergirl", firstName: "Amanda", lastName: "Walker", imageUrl: "https://static.wikia.nocookie.net/invincible/images/8/8e/Monster_Girl.png" },
    { alias: "@cecilstedman", firstName: "Cecil", lastName: "Stedman", imageUrl: "https://static.wikia.nocookie.net/invincible/images/c/c4/Cecil_Stedman.png" },
    { alias: "@debbieoconnell", firstName: "Debbie", lastName: "Grayson", imageUrl: "https://static.wikia.nocookie.net/invincible/images/d/d5/Debbie_Grayson.png" },
    { alias: "@arterosenbaum", firstName: "Art", lastName: "Rosenbaum", imageUrl: "https://static.wikia.nocookie.net/invincible/images/a/a4/Art_Rosenbaum.png" },
    { alias: "@darkwing", firstName: "Dark", lastName: "Wing", imageUrl: "https://static.wikia.nocookie.net/invincible/images/2/2b/Darkwing.png" },
    { alias: "@bulletproof", firstName: "Zandale", lastName: "Randolph", imageUrl: "https://static.wikia.nocookie.net/invincible/images/b/b4/Bulletproof.png" },
    { alias: "@thinkman", firstName: "Think", lastName: "Man", imageUrl: "https://static.wikia.nocookie.net/invincible/images/e/e0/Thinker.png" },
    { alias: "@omegaman", firstName: "Omega", lastName: "Man", imageUrl: "https://static.wikia.nocookie.net/invincible/images/1/1b/Omni-Man.png" },
    { alias: "@immortal", firstName: "The", lastName: "Immortal", imageUrl: "https://static.wikia.nocookie.net/invincible/images/1/1b/Omni-Man.png" },
];

async function seed() {
    console.log("Starting seed...");
    const passwordHash = await bcrypt.hash("password123", 10);
    console.log(`Generated password hash`);

    for (const user of fakeUsers) {
        try {
            await client.send(new PutCommand({
                TableName: "Users",
                Item: {
                    alias: user.alias,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    imageUrl: user.imageUrl,
                    passwordHash
                }
            }));
            console.log(`Created user ${user.alias}`);

            await client.send(new PutCommand({
                TableName: "Follows",
                Item: {
                    followerAlias: user.alias,
                    followeeAlias: followeeAlias
                }
            }));
            console.log(`${user.alias} now follows ${followeeAlias}`);
        } catch (error) {
            console.error(`Error processing ${user.alias}:`, error);
        }
    }
    console.log("Seeding complete!");
}

console.log("Script started");
seed().catch(console.error);