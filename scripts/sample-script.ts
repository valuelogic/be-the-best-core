import { ethers } from 'hardhat';

const changeGreeting = async (greeting: string) => {
    const greeter = await ethers.getContract('Greeter');

    const tx = await greeter.setGreeting(greeting);
    await tx.wait(1);

    console.log('Greeting has been changed.');
};

changeGreeting('New greeting')
    .then(() => process.exit(0))
    .catch((e) => {
        console.log(e);
        process.exit(1);
    });
