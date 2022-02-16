import GTM from "../constants";

const pushShareData = (socialName, id) => {
  console.log({
    event: GTM.EVENT.SHARE,
    method: socialName,
    content_type: "url",
    item_id: id,
  });
  gtag({
    event: GTM.EVENT.SHARE,
    method: socialName,
    content_type: "url",
    item_id: id,
  });
};

export default pushShareData;
