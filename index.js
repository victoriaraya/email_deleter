import "dotenv/config";
import Imap from "imap";
import { inspect } from "util";

const addresses = [
  "Credit Card Offer",
  "Insurance Savings for Car",
  "TruGreen Lawn Service",
  "Property-Offer",
  "OrangeTheoryFitness",
  "Unclaimed Gov Money",
  "Tax Relief Optima",
  "RenewalbyAndersen",
  "3 Bureau Number",
  "Renewal By Andersen",
  "Rain",
  "ADT Security Services",
  "ADT",
  "Farmers Insurance",
  "Hiring Manager",
  "Liberty Mutual Quote",
  "National Debt Relief",
  "Class Action Claims",
  "AHS Warranty",
  "CarShield Partner",
  "Fast Quotes Coverage",
  "ObamaCare Health",
  "Vivint.SmartHome Security",
  "VIVINT Premier Partner",
  "Medicare Advantage Plans",
  "Gutter Guard Offer",
  "FidelityLife Insurance",
  "FidelityLife Quote",
  "Globe Life Details",
  "Aflac",
  "Join Today!",
  "ParkMobile",
  "Recipe Reader",
  "Blue Sky Auto Insurance",
  "American home warranty Plans",
  "Globe Life Insurance Alert",
  "American Home Shield Network",
  "Rent to Own Properties",
  "Oil Change Deals",
  "Command Cooking",
  "pch sweepstakes",
  "RbA Replacements",
  "Budget Blinds",
  "LibertyMutualQuoteTeam",
  "Check Your Credit",
  "Heartland Cooking",
  "Bankruptcy Options",
  "Sell.My.House.Fast",
  "LibertyUniversity",
  "Metal Roofing Innovations Promotions",
  "USInsuranceOnline",
  "Fidelity.Life.Coverage",
  "Miracle-made-sheets",
  "American express",
  "A Place for Mom Partner",
  "Oil Change Coupons",
  "GlobeLife - Offer",
  "Insurance Savings Deals",
  "Canvas Prints Promotion",
  "Wells Fargo Online",
  "Walmart Customer Experience",
  "CVS Opinion Requested",
  "Word Zapp",
  "Auto:Insurance:Comparisons",
  "DISH TV Retailer",
  "MedicareComparisonShop",
  "Auto Insurance Comparisons",
  "Big Sky Credit Offer",
  "HEXI Los Angeles",
  "Your Car Insurance",
  "M.O.W.",
  "LawsuitHelps Offer",
  "Bloomingdale's The Outlet Stores",
  "Compare",
  "Auto Quote Reduction.",
  "TruGreen Limited Time Sale",
  "Compare .com Car Coverage",
  "Vivint Deal",
  "LeafFilter Promo",
  "ADT Peace of Mind",
  "My Loan Companion",
  "Debt Relief Team",
  "Vivint Home Security",
  "BrinksHomeOffer Info",
  "Liberty_Mutual_Insurance",
  "myLoanAlly",
  "National Debt Relief Service",
  "TruGreen Lawn Care Professionals",
  "Records Trivia",
  "Insurify",
  "Explain It Daily",
  "Need To Know Facts",
  "Words Trivia",
  "Iron Chef AI",
  "AEG Presents LA",
  "INTERNATIONAL MONETARY FUND",
  "Truthfully",
  "Ella",
  "Matchacha",
  "Breck's",
  "Good News Instead",
  "Credit Card Promotion",
  "Endurance Warranty Services",
  "3 Day Blinds",
  "The University of Edinburgh",
  "Window Experts",
  "TurboTax Monthly",
  "Consumer Cellular Plans"
];

let pendingOperations = 0;

const checkEndConnection = () => {
  if (pendingOperations === 0) {
    imap.end();
  }
};

const dynamicSearchAndDelete = (addresses) => {
  for (let i = 0; i < addresses.length; i += 2) {
    let conditions;
    if (i + 1 < addresses.length) {
      conditions = [
        "UNSEEN",
        ["OR", ["FROM", addresses[i]], ["FROM", addresses[i + 1]]],
      ];
    } else {
      conditions = ["UNSEEN", ["FROM", addresses[i]]];
    }
    pendingOperations++;
    imapSearchAndDelete(conditions);
  }
};

const imap = new Imap({
  user: process.env.ATT_USERNAME,
  password: process.env.ATT_PASSWORD,
  host: "imap.mail.yahoo.com",
  port: 993,
  tls: true,
});

const imapSearchAndDelete = (searchCriteria) => {
  imap.search(searchCriteria, (err, results) => {
    if (err) {
      console.error("Search error:", err);
      pendingOperations--;
      checkEndConnection();
      return;
    }

    console.log("Search results:", results);

    if (results.length === 0) {
      console.log("No unread emails from the specified addresses.");
      pendingOperations--;
      checkEndConnection();
      return;
    }

    const fetch = imap.fetch(results, { bodies: "" });

    fetch.on("message", (msg, seqno) => {
      console.log(`Fetched message #${seqno}`);

      msg.once("attributes", (attrs) => {
        let uid = attrs.uid;
        imap.addFlags(uid, ["\\Deleted"], (err) => {
          if (err) {
            console.error("Add Flags error:", err);
            pendingOperations--;
            checkEndConnection();
            return;
          }

          imap.expunge((err) => {
            if (err) {
              console.error("Expunge error:", err);
              pendingOperations--;
              checkEndConnection();
              return;
            }

            console.log("Deleted all specified messages.");
            pendingOperations--;
            checkEndConnection();
          });
        });
      });

      fetch.once("end", () => {
        console.log("Done fetching all messages.");
      });

      fetch.once("error", (err) => {
        console.error(`Fetch error: ${err}`);
        pendingOperations--;
        checkEndConnection();
      });
    });
  });
};

imap.once("error", (err) => {
  console.error("Connection error:", err);
});

imap.once("ready", () => {
  imap.openBox("Inbox", false, (err, box) => {
    if (err) {
      console.error("Open box error:", err);
      return;
    }

    dynamicSearchAndDelete(addresses);
  });
});

imap.once("end", () => {
  console.log("Connection ended");
});

imap.connect();
