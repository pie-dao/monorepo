// scenario for 12/2021
const votes_window_3 = [
  // alice
  {
    "id": "0x15f4946b633f3164d93a2d5a95484b14f438616381ba81787407ff7c5375399f",
    "voter": "0x3c341129dac2096b88945a8985f0ada799abf8c9",
    "created": 1639562330,
    "vp": 0,
    "proposal": {
      "id": "QmWnu4hqF2x5uyydWGSXzBmLEiVivXZWLLsh1DHFpjEeQC",
      "created": 1634291930,
      "state": "active",
      "snapshot": "13335955",
      "title": "Donate",
      "link": "https://snapshot.org/#/piedao.eth/proposal/QmWnu4hqF2x5uyydWGSXzBmLEiVivXZWLLsh1DHFpjEeQC",
      "choices": [
        "OK!",
        "NO! THX!"
      ]
    },
    "choice": 1,
    "space": {
      "id": "piedao.eth"
    }
  },
  // mickie
  {
    "id": "0x15f4946b633f3164d93a2d5a95484b14f438616381ba81787407ff7c5375399f",
    "voter": "0x3fe4d5d50fd7694b07589510621930aa14ce396e",
    "created": 1639562330,
    "vp": 0,
    "proposal": {
      "id": "QmWnu4hqF2x5uyydWGSXzBmLEiVivXZWLLsh1DHFpjEeQC",
      "created": 1634291930,
      "state": "active",
      "snapshot": "13335955",
      "title": "Donate",
      "link": "https://snapshot.org/#/piedao.eth/proposal/QmWnu4hqF2x5uyydWGSXzBmLEiVivXZWLLsh1DHFpjEeQC",
      "choices": [
        "OK!",
        "NO! THX!"
      ]
    },
    "choice": 1,
    "space": {
      "id": "piedao.eth"
    }
  } 
];

export const VotesStub3 = (): Array<any> => {
  return votes_window_3;
}