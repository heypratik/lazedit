function replaceText(obj, newText, type = "text") {
  if (type === "text") {
    const containsHTML = (str) => /<\/?[a-z][\s\S]*>/i.test(str);
    if (containsHTML(obj.text)) {
      obj.text = obj.text.replace(
        /(?<=<[^>]*>)([^<]+)(?=<\/[^>]*>)/g,
        (match) => newText
      );
    } else {
      obj.text = newText;
    }
    
    return obj;
  } else if (type === "heading") {
    obj.text = newText;
    return obj;
  }
}

// Example usage:
// let updatedObj = replaceText(obj, "Our customers' testimonials!");
// console.log(updatedObj.text);

function returnAllChildren(email, contextData) {
  // Check if email is an array
  if (Array.isArray(email)) {
    for (let emailData of email) {
      returnAllChildren(emailData, contextData); // Recursively call the function for each item in the array
    }
  } else {
    // email is an object, process it
    const emailCol = email;

    if (emailCol.children && emailCol.children.length > 0) {
      for (let emailChild of emailCol.children) {
        if (emailChild.children && emailChild.children.length > 0) {
          for (let emailChildAll of emailChild.children) {
            // Check and modify items based on itemClass
            if (emailChildAll.itemClass === "logo") {
              emailChildAll.src = contextData?.logo
                ? contextData?.logo
                : "https://cdn2.hubspot.net/hubfs/53/image8-2.jpg";
            }

            if (emailChildAll.itemClass === "banner") {
              emailChildAll.src = contextData?.banner
                ? contextData?.banner
                : "https://cdn2.hubspot.net/hubfs/53/image8-2.jpg";
            }
            if (emailChildAll.itemClass === "introductory_text") {
              let updatedObj = replaceText(
                emailChildAll,
                contextData?.introductoryText
                  ? contextData?.introductoryText
                  : "Welcome to store!",
                //   : "ERROR102",
                "heading"
              );
            }

            if (emailChildAll.itemClass === "discount") {
              let updatedObj = replaceText(
                emailChildAll,
                contextData?.discount ? contextData?.discount : "HEY TRY50 NEW"
              );
            }

            if (emailChildAll.itemClass === "subtitle") {
              console.log(emailChildAll, "emailChildAll");
              console.log(contextData?.subTitle)
              let updatedObj = replaceText(
                emailChildAll,
                contextData?.subTitle ? contextData?.subTitle : "SHOP TODAY!"
              );
            }

            if (emailChildAll.itemClass === "company_info") {
              let updatedObj = replaceText(
                emailChildAll,
                contextData?.companyInfo
                  ? contextData?.companyInfo
                  : "Lorem Ipsum 2024"
              );
            }

            if (emailChildAll.itemClass === "dynamic") {
              emailChildAll.list = contextData?.products
                ? contextData?.products
                : [];
            }

            if (emailChildAll.itemClass === "social_links") {
              let formatSocials = [];
              let images = {
                "facebook": "https://iili.io/HMnhdkN.png",
                "instagram": "https://iili.io/J9qWqNV.png",
                "tiktok": "https://iili.io/J9qWBDB.png",
                "twitter": "https://iili.io/J9qWnoP.png"
              }

              for (let social in contextData?.socialLinks) {
                if (contextData?.socialLinks[social] !== "") {
                  formatSocials.push({
                    image: images[social],
                    title: social.charAt(0).toUpperCase() + social.slice(1), 
                    linkURL: "",
                    link: contextData?.socialLinks[social]
                });
                }
            }
            
              
              
            emailChildAll.list = formatSocials;
            }
          }
        }
      }
    }

    return emailCol;
  }

  return email;
}

export default function EmailTemplateReplacer(template, contextData) {
  console.log(contextData, "contextData");
  console.log(template, "template");
  const updatedTemplate = returnAllChildren(template, contextData);
  return updatedTemplate;
}
