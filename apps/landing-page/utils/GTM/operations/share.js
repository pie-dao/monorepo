import GTM from "../constants";

const pushShareData = (socialName, id) => {
  gtag({
    event: GTM.EVENT.SHARE,
    method: socialName,
    content_type: "url",
    item_id: id,
  });
};

export default pushShareData;
