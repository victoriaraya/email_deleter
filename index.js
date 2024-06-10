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
  "Farmers Insurance",
];

const buildOrConditions = (addresses) => {
  if (addresses.length === 1) {
    return ["FROM", addresses[0]];
  }
  return ["OR", ["FROM", addresses[0]], buildOrConditions(addresses.slice(1))];
};

const searchCriteria = buildOrConditions(addresses);

const imap = new Imap({
  user: process.env.ATT_USERNAME,
  password: process.env.ATT_PASSWORD,
  host: "imap.mail.yahoo.com",
  port: 993,
  tls: true,
});

imap.once("error", console.error);
imap.once("ready", () => {
  imap.openBox("Inbox", false, (err, box) => {
    if (err) throw error;

    imap.search(["UNSEEN", searchCriteria], (error, results) => {
      if (error) throw error;

      if (results.length === 0) {
        console.log("No unread emails from the specified addresses.");
        imap.end();
        return;
      }

      imap.addFlags(results, "\\Deleted", (err) => {
        if (err) throw err;

        imap.expunge((err) => {
          if (err) throw err;

          console.log("Deleted all specified messages.");
          imap.end();
        });
      });
    });
  });
});

imap.connect();
