describe('Angle Tests', () => {
    it('Should log in and flip through options in dashboard', () => {
        cy.visit('https://angle.devmtn-projects.com/#/')
        cy.get('button.login-button')
            .click();
        cy.get('#btn-google')
            .click();
        cy.wait(5000);
        cy.get('a.create-button')
            .click();
        cy.get('.create-project > input:first-of-type')
            .type(`cypress-test-project ${new Date()}`)
        cy.get('.create-project > select:first-of-type')
            .select('Musician')
        cy.get('.create-project > textarea')
            .type(`This test project was created at ${new Date()}`)
        cy.get('[type="date"]')
            .type('2018-04-20')
        cy.get('.create-project > select:nth-of-type(2)')
            .select('14')
        cy.get('.create-project > select:nth-of-type(3)')
            .select('$50.00')

        const dropEvent = {
            dataTransfer: {
                files: [
                ],
            },
        };

        cy.fixture('/lotr.jpg').then((picture) => {
            return Cypress.Blob.base64StringToBlob(picture, 'image/jpeg').then((blob) => {
                console.log(blob);
                dropEvent.dataTransfer.files.push(blob);
            });
        });



        cy.get('.dropzone').trigger('drop', dropEvent);
        cy.get('button').contains('Submit')
            .click();
    })
})