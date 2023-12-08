const { softAssert, softExpect } = chai;
import DatosClientes from '../../../../../Builder/datosClientesBuilder';
import Url from '../../../../../Builder/urlBuilder'
import MtvComboActivo from '../../../../../pageObjects/MTV/ADM/ActivarDisneyYStar/mtvComboActivoPage'

const urlAmbiente = Cypress.env('urlMiMovistar')
const url = new Url().urlMtv()
const datosClientes = new DatosClientes().convergente2(urlAmbiente).build()
const mtvComboActivo = new MtvComboActivo()
describe("Taggeo Combo Activo -ingreso.OTP", function () {

    beforeEach("Carga de fixture e ingreso a la aplicación", function () {
        cy.clearCookies();

        // Parametros para un log mas limpio.
        cy.intercept({ resourceType: 'xhr' }, { log: false })
        cy.intercept({ resourceType: 'fetch' }, { log: false })

        //Entramos al archivo .json
        cy.fixture('dataLayerMtv').then((dataLayFixture) => {
            this.dataLFixture = dataLayFixture;
        })

        cy.loginIdp(urlAmbiente, datosClientes.email, datosClientes.pass)
        cy.wait(2000)
        cy.lineaEnContexto(datosClientes.aniInternetConMtv)
        cy.visit(urlAmbiente + url.comboActivo)
        cy.wait(2000)
    });

    it("01 - Combo Activo - WebView", { tags: ['regresion', 'mtvTageo'] }, function () {
        // Accede al objeto "window" del navegador y ejecuta una función cuando esté disponible.
        cy.window().then(win => {
            cy.wait(4000)
            // "Espía" la función "push" del objeto "dataLayer" en el objeto "window" y se lo nombra como "@event".
            cy.spy(win.dataLayer, "push").as("event");
            // Obtiene el valor capturado por el "espía" y ejecuta una función.
            cy.get("@event").then((calledEvent) => {
                cy.log(JSON.stringify(win.dataLayer))

                // Define un OBJETO con propiedades.
                let dataL = {
                    event: this.dataLFixture.combo_active.webview.event,
                    pageName: this.dataLFixture.combo_active.webview.pageName,
                    eventFunctionality: this.dataLFixture.combo_active.webview.eventFunctionality,
                    eventOrder: this.dataLFixture.combo_active.webview.eventOrder,
                };

                // Mapea(transformar) los elementos del "dataLayer" capturado y los reformatea en un nuevo arreglo llamado "winDatalayer".
                let winDatalayer = win.dataLayer.map(function (item) {
                    return {
                        event: item.event,
                        pageName: item.pageName,
                        eventFunctionality: item.eventFunctionality,
                        eventOrder: item.eventOrder,
                    };
                });

                const resultado = winDatalayer.find(data =>
                    data.event === dataL.event &&
                    data.pageName === dataL.pageName &&
                    data.eventFunctionality === dataL.eventFunctionality &&
                    data.eventOrder === dataL.eventOrder
                );
                assert.deepEqual(dataL, resultado)
            })
        })
    })

    // Se lo comenta ya que no se puede ingresar al DATALAYER
    /* it("02 - Combo Activo - Botón Ir a start", { tags: ['regresion', 'mtvTageo'] }, function () {
        mtvComboActivo.getBotonPrincipal().click()
        // Accede al objeto "window" del navegador y ejecuta una función cuando esté disponible.
        cy.window().then(win => {
            cy.wait(2000)
            // "Espía" la función "push" del objeto "dataLayer" en el objeto "window" y se lo nombra como "@event".
            cy.spy(win.dataLayer, "push").as("event");
            // Obtiene el valor capturado por el "espía" y ejecuta una función.
            cy.get("@event").then((calledEvent) => {
                cy.log(JSON.stringify(win.dataLayer))

                // Define un OBJETO con propiedades.
                let dataL = {
                    event: this.dataLFixture.combo_active.button_see_current_plan.event,
                    eventCategory: this.dataLFixture.combo_active.button_see_current_plan.eventCategory,
                    eventAction: this.dataLFixture.combo_active.button_see_current_plan.eventAction,
                    eventLabel: this.dataLFixture.combo_active.button_see_current_plan.eventLabel,
                    eventFunctionality: this.dataLFixture.combo_active.button_see_current_plan.eventFunctionality,
                    eventOrder: this.dataLFixture.combo_active.button_see_current_plan.eventOrder
                };

                // Mapea(transformar) los elementos del "dataLayer" capturado y los reformatea en un nuevo arreglo llamado "winDatalayer".
                let winDatalayer = win.dataLayer.map(function (item) {
                    return {
                        event: item.event,
                        eventCategory: item.eventCategory,
                        eventAction: item.eventAction,
                        eventLabel: item.eventLabel,
                        eventFunctionality: item.eventFunctionality,
                        eventOrder: item.eventOrder
                    };
                });

                const resultado = winDatalayer.find(data =>
                    data.event === dataL.event &&
                    data.eventCategory === dataL.eventCategory &&
                    data.eventAction === dataL.eventAction &&
                    data.eventLabel === dataL.eventLabel &&
                    data.eventFunctionality === dataL.eventFunctionality &&
                    data.eventOrder === dataL.eventOrder
                );
                assert.deepEqual(dataL, resultado)
            })
        })
    }) */
})
