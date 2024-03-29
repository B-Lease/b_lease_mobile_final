// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  mapbox:{
    accessToken: 'pk.eyJ1IjoiaGFja25jb2RlMjAyMyIsImEiOiJjbGZiYTRrdG0ybXVrM3NwcWl1dGE2Y2Q4In0.7x9X9Nlb6WYocUO6WrUA1A'
  },

  // API URL and SOCKET_API_URL defined here
  //Change this if you change your server network

  API_URL: 'http://192.168.1.9:5000/',

  
  SOCKET_API_URL: 'http://192.168.1.9:5001',


  //This is the template for greeting message when Lessees inquire properties
  greeting_message: "Hi there! I came across your property listing and I'm interested in learning more about it",

  //This is the template for the terms and conditions
  terms:`Welcome to B-Lease, the mobile application that allows you to lease and rent properties easily. These terms and conditions (the "Agreement") govern your use of the B-Lease application ("the App") and all related services provided by B-Lease Inc. ("the Company"). By downloading, installing or using the App, you agree to be bound by the terms and conditions of this Agreement. \n\n\n 1. REGISTRATION: In order to use the App, you must register and create an account. You agree to provide accurate and complete information during registration and to keep your account information up-to-date. You are responsible for maintaining the confidentiality of your account login credentials and for all activities that occur under your account.\n\n 2. USE OF THE APP: The App is designed to facilitate the leasing and renting of properties. You agree to use the App only for lawful purposes and in compliance with all applicable laws, rules, and regulations. You may not use the App to engage in any activity that is illegal, unethical, or harmful. \n\n 3. PROPERTY LISTINGS: The Company does not own, lease or rent any properties listed on the App. The Company is not responsible for the accuracy, completeness, or legality of any property listing on the App. The Company reserves the right to remove or modify any property listing on the App at any time and without notice. \n\n 4. FEES: The use of the App is free for lessees and lessors. The Company reserves the right to change its fee structure at any time and without notice. Lessors will be charged a commission of 12% of their income for every successful lease transaction. Lessees will be charged a fixed transactional fee of Php 210 for every successful lease transaction. Properties listed for lease must have a minimum monthly rental price of Php 19,000. Lease contracts must have a minimum duration of 6 months. \n\n 5. PAYMENTS: Both lessees and lessors may be subject to fees for the use of the App or related services. The Company reserves the right to change its fee structure at any time and without notice. The App may allow for the payment of rental fees, service fees, and other charges. You agree to pay all fees and charges in accordance with the terms and conditions set forth on the App. All payments are processed through a third-party payment processor and the Company is not responsible for any errors or disputes related to payments made through the App. \n\n 6. INTELLECTUAL PROPERTY: The App and all content and materials on the App, including but not limited to, logos, text, graphics, images, and software, are owned by the Company or its licensors and are protected by copyright, trademark, and other intellectual property laws. You may not use or reproduce any of the content or materials on the App without the prior written consent of the Company. \n\n 7. DISCLAIMER OF WARRANTIES: The App and all related services are provided on an “as is” and “as available” basis without warranties of any kind, either express or implied. The company disclaims all warranties, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, and non infringement. \n\n 8. LIMITATION OF LIABILITY: The company shall not be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in connection with your use of the App or related services. In no event shall the company’s total liability exceed the amount you paid to the company in the past six months. \n\n 9. INDEMNIFICATION: You agree to indemnify, defend, and hold harmless the Company and its officers, directors, employees, and agents from any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or in connection with your use of the App or related services. \n\n10. MODIFICATIONS: The Company reserves the right to modify or update this Agreement at any time and without notice. Your continued use of the App following any such modification constitutes your agreement to be bound by the modified Agreement. \n\n11. GOVERNING LAW: This Agreement shall be governed by and construed in accordance with the laws of the state where the Company is headquartered, without regard to its conflict of laws \n\n12. RENTAL TERM: The minimum rental term for any property listed on the App shall be 6 months. The Company is not responsible for any disputes related to rental terms and conditions agreed upon by the lessor and lessee. \n\n13. CONTRACTS: Lessors and lessees shall not enter into any rental agreements or contracts for any property listed on the App without notifying the Company and obtaining the Company's approval in writing. The Company reserves the right to refuse approval for any rental agreement or contract for any reason. The Company is not responsible for any disputes related to rental agreements or contracts entered into by lessors and lessees without the Company's approval. \n\n`

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
