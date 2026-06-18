import csv
import os
import random

# Typo and obfuscation logic
def add_typo_noise(text, p=0.08):
    if not text:
        return text
    chars = list(text)
    for i in range(len(chars) - 1):
        if random.random() < p:
            if chars[i].isalpha() and chars[i+1].isalpha():
                # Swap adjacent characters
                chars[i], chars[i+1] = chars[i+1], chars[i]
            elif random.random() < 0.5:
                # Omit character
                chars[i] = ''
    return "".join(chars)

def add_unicode_obfuscation(text, p=0.05):
    homoglyphs = {
        'a': 'а', 'e': 'е', 'o': 'о', 'p': 'р', 'c': 'с', 'y': 'у', 'i': 'і',
        'A': 'А', 'E': 'Е', 'O': 'О', 'P': 'Р', 'C': 'С', 'Y': 'У', 'I': 'І'
    }
    chars = list(text)
    for i in range(len(chars)):
        if chars[i] in homoglyphs and random.random() < p:
            chars[i] = homoglyphs[chars[i]]
    return "".join(chars)

def generate_corpus():
    os.makedirs("datasets/raw/messages", exist_ok=True)
    os.makedirs("datasets/raw/url", exist_ok=True)
    
    categories = [
        "Fake Job Scam", "Fake KYC Scam", "Lottery Scam", 
        "Marketplace Scam", "Investment Scam", "Advance Payment Scam"
    ]
    
    # 8 templates per category per language to completely eliminate duplicate structure
    templates = {
        "en": {
            "Fake Job Scam": [
                "Urgent! Earn Rs.{amt} daily working from home. Simple YouTube video likes. Contact via WhatsApp: {phone}.",
                "Congratulations! Your resume has been selected for the post of data operator. Salary Rs.{amt} per month. Register here: {url}.",
                "Part-time job vacancy: Earn Rs.{amt} daily by rating films. No experience needed. Join: {url}.",
                "Work from home opportunity! Earn up to Rs.{amt} weekly. Daily payouts. Click to join: {url}.",
                "Urgent hiring for online assistant! Earn Rs.{amt}/day. Contact HR on WhatsApp: {phone}.",
                "Selected for Remote Job. Income: Rs.{amt}/month. Free training provided. Link: {url}.",
                "Earn part time Rs.{amt} daily. Simple task: Google Maps review. Details: {url} or call {phone}.",
                "YouTube like tasks. Earn Rs.{amt} instantly. Connect with HR now: {phone}."
            ],
            "Fake KYC Scam": [
                "Dear customer, your SBI bank account will be blocked today. Please complete your KYC verification immediately: {url}.",
                "Alert: Paytm wallet suspended due to missing KYC. Call helpline {phone} or visit {url} to update details.",
                "Your HDFC netbanking access is locked. Verify PAN card now to avoid suspension: {url}.",
                "Urgent notice: Bank account freeze initiated. Update your KYC within 24 hours at: {url}.",
                "Important: Please verify your phone number to update bank credentials. Link: {url}.",
                "SBI Account Alert: Your debit card is blocked. Reactivate by updating KYC details here: {url}.",
                "Dear user, your mobile SIM card will be deactivated. Verify Aadhar immediately at: {url} or call {phone}.",
                "Wallet suspended. Update your KYC details at: {url} to restore transaction limit."
            ],
            "Lottery Scam": [
                "Dear user, you have won a cash prize worth Rs.{amt} in KBC lottery. Claim your reward code at UPI: {upi} or link {url}.",
                "Congratulations! You won a brand new car and cash. Pay Rs.{fee} registration fees via UPI: {upi} to dispatch.",
                "Lucky Winner! You won Rs.{amt} in our lucky draw. Pay tax fee Rs.{fee} to UPI: {upi} to receive.",
                "KBC Lottery Alert: Ticket #{num} won Rs.{amt}. Contact agent via WhatsApp: {phone} to claim.",
                "Congratulations, you won Rs.{amt} cash gift. Send registration fee Rs.{fee} to UPI: {upi} immediately.",
                "Your email won Rs.{amt} in international sweepstakes. Pay clearance fee Rs.{fee} to UPI: {upi} to claim.",
                "Dear customer, you won a free vacation package. Pay processing fee Rs.{fee} to UPI: {upi} to activate.",
                "KBC cash prize Rs.{amt} credited to your name. Pay file processing fee Rs.{fee} to UPI: {upi}."
            ],
            "Marketplace Scam": [
                "Selling second hand bike in pristine condition. Price Rs.{amt}. Send refundable advance shipping deposit of Rs.{fee} to UPI: {upi}.",
                "OLX Deal: iPhone 14 Pro for Rs.{amt}. Pay half advance to book, shipping receipt will be sent on WhatsApp: {phone}.",
                "Urgent sale: Smart TV for Rs.{amt}. Pay Rs.{fee} booking amount via UPI: {upi} to hold.",
                "Selling double bed, moving abroad. Price Rs.{amt}. Secure it with advance deposit Rs.{fee} to UPI: {upi}.",
                "OLX listings: Selling refrigerator for Rs.{amt}. Transfer delivery charges Rs.{fee} to UPI: {upi} to dispatch.",
                "Pre-owned car in mint condition. Total cost Rs.{amt}. Pay token money Rs.{fee} to UPI: {upi} to reserve.",
                "Moving sale! AC for Rs.{amt}. Refundable security fee Rs.{fee} to UPI: {upi} for home delivery.",
                "OLX verified seller. Selling iPad for Rs.{amt}. Pay Rs.{fee} advance courier fee via UPI: {upi}."
            ],
            "Investment Scam": [
                "Double your savings in 7 days! TrustNet crypto trading bots guarantee {profit}% returns daily. Join telegram group or register: {url}.",
                "Govt approved high-yield investment scheme. Invest Rs.{amt} and get Rs.{returns} within a week. UPI: {upi}.",
                "Make {profit}% daily return on stock options trading signals. Join vip group: {url}.",
                "Crypto investment opportunity. Deposit Rs.{amt} and get hourly returns of {profit}%. Register now: {url}.",
                "Passive income system: Invest Rs.{amt} and receive Rs.{returns} monthly guaranteed returns. UPI: {upi}.",
                "Forex trading signal bot. Make Rs.{returns} per day with Rs.{amt} capital. Link: {url}.",
                "Earn {profit}% profit daily with zero risk. Register on our platform: {url} or pay via UPI: {upi}.",
                "Invest in high returns startup fund. Turn Rs.{amt} into Rs.{returns} in 30 days. UPI: {upi}."
            ],
            "Advance Payment Scam": [
                "Pay processing fee Rs.{fee} to finalize documentation and unlock loan sanction. Send money to UPI: {upi}.",
                "Customs duty payment alert. Your parcel is held at airport. Transfer Rs.{fee} immediately to release parcel. UPI: {upi}.",
                "Your loan of Rs.{amt} is approved. Transfer Rs.{fee} documentation fee to UPI: {upi} to credit amount.",
                "Courier notification: Import tax of Rs.{fee} pending. Pay via UPI: {upi} to resume delivery.",
                "Sanction fee of Rs.{fee} required for PM Mudra Loan. Transfer to UPI: {upi} for instant disbursal.",
                "Package blocked by international customs. Clear customs penalty Rs.{fee} to UPI: {upi} to avoid legal action.",
                "Security clearance deposit Rs.{fee} required to process your refund. Send to UPI: {upi}.",
                "Pay stamp duty fee Rs.{fee} to get your prize money. Transfer immediately to UPI: {upi}."
            ],
            "Legitimate": [
                "Hey {name}, let's meet up for coffee at {time} {day} near the {loc}.",
                "Reminder: Your monthly electricity bill of Rs.{amt} is due by {day}. Pay using bank app.",
                "Can you send the project presentation files by {time} {day}, {name}? Thanks.",
                "Your parcel has been delivered to your doorstep. Rate your delivery experience. #{num}.",
                "Hi {name}, please check the email attachment for project details. Let me know your feedback.",
                "Are we still on for lunch {day} at the {loc}? Please let me know {name}.",
                "Dear customer, your order #{num} has been dispatched. Track status here.",
                "Hey {name}, congrats on your promotion! We should celebrate soon on {day}."
            ]
        },
        "hinglish": {
            "Fake Job Scam": [
                "Ghar baithe kamayein Rs.{amt} rozana. YouTube videos like karke. WhatsApp karein: {phone}.",
                "Aapki profile process ho gayi hai part-time job ke liye. Roz 2 ghante kaam, Rs.{amt} salary. Click karein: {url}.",
                "Part time ghar se kaam karke Rs.{amt} kamayein. YouTube reviews work. Register: {url}.",
                "Selected for YouTube tasks! Rozana Rs.{amt} income. HR ko WhatsApp message karein: {phone}.",
                "Ghar se video likes tasks. Roz Rs.{amt} earn karein. Joining bilkul free. Link: {url}.",
                "Work from home vacancy. Salary Rs.{amt}/month. Daily payout milega. Contact: {phone}.",
                "Aapka select online job ke liye hua hai. Weekly salary Rs.{amt}. Apply: {url}.",
                "YouTube subscriber task. 5 mins work, Rs.{amt} daily income. Message HR: {phone}."
            ],
            "Fake KYC Scam": [
                "Aapka bank account block hone wala hai. KYC update karein turant is link par click karke: {url}.",
                "Paytm KYC pending hai. Account freeze hone se bachayein. Call customer care: {phone}.",
                "Aapka SIM card block ho jayega. Aadhar card update karein turant link par: {url}.",
                "Alert: SBI Netbanking temporarily lock ho gayi hai. Unlock ke liye KYC verify karein: {url}.",
                "Paytm wallet limit expire ho gayi hai. KYC upgrade karein is link par: {url}.",
                "Bank Account freeze alert! KYC update ke liye click karein: {url} ya call karein: {phone}.",
                "Customer Care notice: Card block hone se bachane ke liye verify karein link: {url}.",
                "Deactivation warning: Netbanking activate rakhne ke liye PAN update karein: {url}."
            ],
            "Lottery Scam": [
                "Aapne jeeta hai Rs.{amt} ka KBC cash prize. Prize claim karne ke liye processing fee Rs.{fee} bhejein UPI: {upi}.",
                "Mubarak ho! Aapko mila hai free gift coupon. Tax amount Rs.{fee} pay karein UPI: {upi} par.",
                "KBC Lucky Draw Winner! Rs.{amt} prize jeeta hai. File charges Rs.{fee} send karein UPI: {upi}.",
                "Aapka number KBC lottery mein select hua hai. WhatsApp par contact karein: {phone}.",
                "Congratulations! Rs.{amt} jackpot winner. Reg fee Rs.{fee} transfer karein UPI: {upi}.",
                "Lucky draw lottery won Rs.{amt}. Clearance fees Rs.{fee} pay karein: {upi}.",
                "Aapko KBC ticket par Rs.{amt} inaam mila hai. Claim ke liye fee Rs.{fee} bhejein: {upi}.",
                "Ghar baithe jackpot won! Rs.{amt} reward. processing fee Rs.{fee} to UPI: {upi}."
            ],
            "Marketplace Scam": [
                "OLX bike bechni hai urgent. Rs.{amt} price. Advance token money Rs.{fee} transfer karein UPI: {upi}.",
                "Second hand laptop Rs.{amt} mein available. WhatsApp karein book karne ke liye: {phone}.",
                "iPhone 13 urgent sale, price Rs.{amt}. Delivery fee Rs.{fee} pehle pay karein UPI: {upi}.",
                "Selling LED TV for Rs.{amt}. Advance shipping security deposit Rs.{fee} to UPI: {upi}.",
                "OLX seller: Sofa set bechna hai urgent, price Rs.{amt}. Security deposit Rs.{fee} to UPI: {upi}.",
                "Car bechni hai mint condition mein, price Rs.{amt}. Token money Rs.{fee} to UPI: {upi}.",
                "Moving sale: AC Rs.{amt} mein. Home delivery charge Rs.{fee} advance pay karein: {upi}.",
                "OLX verified dealer: iPad Rs.{amt} mein. Reserve ke liye pay karein Rs.{fee} to UPI: {upi}."
            ],
            "Investment Scam": [
                "Paisa double scheme! Rozana {profit}% profit guaranteed. Telegram join karein ya link check karein: {url}.",
                "Rs.{amt} lagayein aur har mahine Rs.{returns} payein. Safe investment. UPI: {upi}.",
                "Crypto automatic profit bot! Rs.{amt} invest karke {profit}% daily. Click: {url}.",
                "Double cash in 5 days! 100% legal government approved scheme. UPI: {upi}.",
                "Telegram signals share trading. Rs.{amt} invest karein, Rs.{returns} earn karein. Link: {url}.",
                "Forex robot daily returns {profit}%. Minimum investment Rs.{amt}. Join: {url}.",
                "Daily interest plan! Deposit Rs.{amt} get Rs.{returns} within 15 days. Register: {url}.",
                "Invest karein Rs.{amt} aur payein double returns {profit}% interest ke sath. UPI: {upi}."
            ],
            "Advance Payment Scam": [
                "Sanction charges Rs.{fee} bhejein taaki loan amount transfer kiya ja sake. Send to UPI: {upi}.",
                "Customs clearance fee Rs.{fee} bacha hai. Pay karein UPI: {upi} par to get courier delivery.",
                "Aapka loan pass ho gaya hai. Processing fee Rs.{fee} advance send karein UPI: {upi}.",
                "Parcel release karne ke liye custom duty tax Rs.{fee} pay karein is UPI par: {upi}.",
                "Mudra loan file verification charge Rs.{fee} pay karein UPI: {upi} par.",
                "Customs clearance report pending. Fee Rs.{fee} pay karein UPI: {upi} par.",
                "Refund credit karne ke liye registration fee Rs.{fee} advance send karein: {upi}.",
                "Prize money file stamp duty Rs.{fee} pay karein UPI: {upi} par."
            ],
            "Legitimate": [
                "Bhai {name}, ghar kab tak aayega? Khana thanda ho raha hai.",
                "Aaj class chalegi kya {name}? Mujhe assignment submit karna hai {day}.",
                "Aapka mobile bill pay ho chuka hai. Transaction amount: Rs.{amt}. Details: #{num}.",
                "Kal meeting kitne baje hai {name}? Confirm karna {day} tak.",
                "Bhai free ho to call karna {day} {time} par, urgent kaam hai.",
                "Haan {name}, main presentation check karke batata hoon {time} tak.",
                "Bhai kal chalna hai kya {loc}? Zaroori shopping karni hai.",
                "Aapka mobile recharge #{num} successfully ho gaya hai. Thank you."
            ]
        },
        "hindi": {
            "Fake Job Scam": [
                "घर बैठे कमाएं रोजाना {amt} रुपये। यूट्यूब वीडियो लाइक करें। संपर्क करें: {phone}।",
                "पार्ट-टाइम नौकरी के लिए आपका चयन हुआ है। मासिक वेतन {amt} रुपये। रजिस्टर करें: {url}।",
                "वीडियो लाइक करें और कमाएं रोजाना {amt} रुपये। बिना किसी निवेश के। संपर्क: {phone}।",
                "घर से काम करने का सुनहरा अवसर। साप्ताहिक कमाई {amt} रुपये। आवेदन करें: {url}।",
                "यूट्यूब चैनल सब्सक्राइब कार्य। रोजाना {amt} रुपये तुरंत। संपर्क व्हाट्सएप: {phone}।",
                "रिमोट जॉब भर्ती: {amt} रुपये प्रति माह। आवेदन के लिए लिंक देखें: {url}।",
                "ऑनलाइन घर बैठे कार्य: रोजाना वेतन {amt} रुपये। पंजीकरण नि:शुल्क: {url}।",
                "गूगल मैप्स रेटिंग जॉब। रोज 10 मिनट कार्य, {amt} रुपये वेतन। संपर्क: {phone}।"
            ],
            "Fake KYC Scam": [
                "आपका बैंक खाता आज ब्लॉक कर दिया जाएगा। कृपया केवाईसी तुरंत पूरा करें: {url}।",
                "पेटीएम केवाईसी लंबित है। खाता फ्रीज होने से बचाने के लिए कॉल करें: {phone}।",
                "आपका सिम कार्ड बंद होने वाला है। तुरंत आधार अपडेट करें: {url} या संपर्क करें: {phone}।",
                "स्टेट बैंक अलर्ट: आपका डेबिट कार्ड ब्लॉक कर दिया गया है। अपडेट करें: {url}।",
                "खाता ब्लॉक चेतावनी! नेटबैंकिंग चालू रखने के लिए पैन कार्ड वेरीफाई करें: {url}।",
                "प्रिय ग्राहक, बैंक खाता सुरक्षा कारणों से लॉक किया गया है। तुरंत केवाईसी करें: {url}।",
                "मोबाइल नंबर बंद होने से बचाएं। तुरंत कॉल करें {phone} या वेरीफाई करें: {url}।",
                "वॉलेट की सीमा समाप्त। बहाल करने के लिए इस लिंक पर केवाईसी अपडेट करें: {url}।"
            ],
            "Lottery Scam": [
                "बधाई हो! आपने जीता है {amt} रुपये का लॉटरी इनाम। दावा करने के लिए यूपीआई: {upi} पर {fee} रुपये भेजें।",
                "आपको केबीसी लॉटरी में {amt} रुपये मिले हैं। टैक्स शुल्क यूपीआई: {upi} पर जमा करें।",
                "लकी ड्रा विजेता! आपने {amt} रुपये जीते हैं। फाइल चार्ज {fee} रुपये भेजें यूपीआई: {upi} पर।",
                "केबीसी जैकपॉट अलर्ट: आपका नंबर {amt} रुपये के लिए चुना गया है। व्हाट्सएप संपर्क: {phone}।",
                "बधाई हो, आपको मिला है उपहार कूपन। फाइल शुल्क {fee} रुपये ट्रांसफर करें यूपीआई: {upi}।",
                "लॉटरी दावा राशि {amt} रुपये। फाइल प्रोसेसिंग शुल्क {fee} रुपये जमा करें यूपीआई: {upi}।",
                "आपको मिला है मुफ्त बम्पर इनाम। टैक्स शुल्क {fee} रुपये भेजें यूपीआई: {upi}।",
                "केबीसी लॉटरी विभाग: {amt} रुपये का इनाम मंजूर। पंजीकरण शुल्क {fee} रुपये भेजें: {upi}।"
            ],
            "Marketplace Scam": [
                "ओएलएक्स पर बाइक बेचने के लिए उपलब्ध है। कीमत {amt} रुपये। टोकन राशि यूपीआई: {upi} पर भेजें।",
                "सस्ते दामों में मोबाइल। अग्रिम भुगतान {fee} रुपये करें। विवरण के लिए व्हाट्सएप: {phone}।",
                "अर्जेंट सेल: सेकेंड हैंड आईफोन {amt} रुपये। बुकिंग शुल्क {fee} रुपये ट्रांसफर करें यूपीआई: {upi}।",
                "घर का सामान बेचना है। एलसीडी टीवी {amt} रुपये। अग्रिम डिपोज़िट {fee} रुपये यूपीआई: {upi}।",
                "ओएलएक्स विक्रेता: सोफा सेट {amt} रुपये। कूरियर चार्ज {fee} रुपये अग्रिम भुगतान: {upi}।",
                "अच्छी हालत में कार। कुल कीमत {amt} रुपये। टोकन एडवांस {fee} रुपये जमा करें: {upi}।",
                "विदेश जा रहे हैं, एसी {amt} रुपये में बेचना है। कूरियर शुल्क {fee} रुपये भेजें: {upi}।",
                "ओएलएक्स सत्यापित डीलर: आईपैड {amt} रुपये। एडवांस बुकिंग शुल्क {fee} रुपये भेजें: {upi}।"
            ],
            "Investment Scam": [
                "7 दिनों में पैसा दोगुना करें। दैनिक {profit}% रिटर्न गारंटी। पंजीकरण करें: {url}।",
                "सुरक्षित सरकारी योजना। {amt} रुपये निवेश करें और {returns} रुपये प्राप्त करें। यूपीआई: {upi}।",
                "क्रिप्टो ट्रेडिंग: {amt} रुपये जमा करें और रोज {profit}% कमाएं। टेलीग्राम लिंक: {url}।",
                "पैसे को करें डबल केवल 5 दिन में। शत प्रतिशत सुरक्षित निवेश योजना। यूपीआई: {upi}।",
                "शेयर बाजार सिग्नल्स: {amt} रुपये निवेश, {returns} रुपये मासिक रिटर्न। टेलीग्राम: {url}।",
                "विदेशी मुद्रा रोबोट दैनिक रिटर्न {profit}%। न्यूनतम राशि {amt} रुपये। पंजीकरण: {url}।",
                "दैनिक ब्याज प्लान: {amt} रुपये निवेश करें, {returns} रुपये प्राप्त करें। रजिस्टर: {url}।",
                "निवेश करें {amt} रुपये और पाएं {profit}% ब्याज के साथ सुरक्षित रिटर्न्स। यूपीआई: {upi}।"
            ],
            "Advance Payment Scam": [
                "ऋण राशि जारी करने के लिए {fee} रुपये का प्रसंस्करण शुल्क भेजें। यूपीआई: {upi}।",
                "सीमा शुल्क निकासी शुल्क {fee} रुपये का भुगतान करें। पार्सल जारी करने के लिए यूपीआई: {upi}।",
                "आपका लोन स्वीकृत हुआ है। फाइल शुल्क {fee} रुपये एडवांस भेजें यूपीआई: {upi}।",
                "पार्सल सीमा शुल्क विभाग में अटका है। टैक्स शुल्क {fee} रुपये का भुगतान करें: {upi}।",
                "मुद्रा लोन फ़ाइल शुल्क {fee} रुपये का तत्काल भुगतान करें यूपीआई: {upi} पर।",
                "पार्सल जारी करने के लिए कूरियर पेनाल्टी शुल्क {fee} रुपये भेजें यूपीआई: {upi}।",
                "रिफंड राशि जारी करने के लिए फाइल स्टांप शुल्क {fee} रुपये एडवांस भेजें: {upi}।",
                "सीमा शुल्क टैक्स {fee} रुपये का भुगतान यूपीआई: {upi} पर करें पार्सल प्राप्त करने के लिए।"
            ],
            "Legitimate": [
                "क्या आप {day} को {name} के साथ डिनर करेंगे?",
                "बिजली बिल {amt} रुपये का भुगतान समय पर करें। धन्यवाद।",
                "आपकी दवाइयां डिलीवर हो चुकी हैं। ऑर्डर विवरण: #{num}।",
                "कल सुबह {time} बजे {loc} में मीटिंग तय की गई है।",
                "{name}, सुनो, क्या कल शाम को चलें {loc} घूमने?",
                "ठीक है {name}, मैं आपको रिपोर्ट {time} पर भेजता हूँ।",
                "बधाई हो {name} आपके नए काम के लिए! पार्टी {day} को है।",
                "कृपया मुझे मेल पर काम की डिटेल्स {time} तक भेजें।"
            ]
        },
        "telugu": {
            "Fake Job Scam": [
                "ఇంట్లో కూర్చుని రోజుకు రూ.{amt} సంపాదించండి. యూట్యూబ్ వీడియోలను లైక్ చేయండి: {phone}.",
                "పార్ట్-టైమ్ ఉద్యోగానికి ఎంపికయ్యారు. నెలకు రూ.{amt} జీతం. ఇక్కడ నమోదు చేసుకోండి: {url}.",
                "యూట్యూబ్ ఛానెల్ లైక్స్ ద్వారా రోజుకు రూ.{amt} సంపాదించండి. వాట్సాప్ చేయండి: {phone}.",
                "ఇంటి నుండి ఆన్‌లైన్ పని. వారానికి రూ.{amt} సంపాదన. ఇక్కడ క్లిక్ చేయండి: {url}.",
                "యూట్యూబ్ సబ్‌స్క్రైబ్ టాస్క్. రూ.{amt} ప్రతిరోజూ. వివరాలకు వాట్సాప్: {phone}.",
                "ఆన్‌లైన్ జాబ్ భర్తీ: నెలకు రూ.{amt}. ఉచిత శిక్షణ. లింక్: {url}.",
                "పార్ట్ టైమ్ ఆన్‌లైన్ వర్క్: రోజువారీ వేతనం రూ.{amt}. రిజిస్ట్రేషన్ ఉచితం: {url}.",
                "గూగుల్ మ్యాప్స్ రేటింగ్ టాస్క్. రోజుకు రూ.{amt} సంపాదించండి. సంప్రదించండి: {phone}."
            ],
            "Fake KYC Scam": [
                "ప్రియమైన కస్టమర్, మీ బ్యాంక్ ఖాతా ఈరోజు బ్లాక్ చేయబడుతుంది. వెంటనే కేవైసీ చేయండి: {url}.",
                "పేటిఎమ్ కేవైసీ పెండింగ్ ఉంది. ఖాతా నిలిపివేయబడకుండా ఉండటానికి కాల్ చేయండి: {phone}.",
                "మీ సిమ్ కార్డ్ బ్లాక్ చేయబడుతుంది. వెంటనే ఆధార్ అప్‌డేట్ చేయండి: {url} లేదా కాల్ చేయండి: {phone}.",
                "బ్యాంక్ ఖాతా నిలిపివేయబడింది. కేవైసీ పునరుద్ధరణ కోసం క్లిక్ చేయండి: {url}.",
                "పేటిఎమ్ వాలెట్ లిమిట్ ముగిసింది. అప్‌గ్రేడ్ చేయడానికి క్లిక్ చేయండి: {url}.",
                "నెట్ బ్యాంకింగ్ లాక్ చేయబడింది. పాన్ కార్డ్ వెరిఫికేషన్ కోసం క్లిక్ చేయండి: {url}.",
                "కస్టమర్ కేర్ నోటీసు: మీ అకౌంట్ బ్లాక్ కాకుండా కేవైసీ చేయండి: {url}.",
                "మీ మొబైల్ నంబర్ డియాక్టివేట్ కాకుండా ఆధార్ కార్డ్ అప్‌డేట్ చేయండి: {url}."
            ],
            "Lottery Scam": [
                "అభినందనలు! మీరు రూ.{amt} కేబీసీ లాటరీ గెలుచుకున్నారు. క్లెయిమ్ చేయడానికి రూ.{fee} యూపీఐ: {upi} కి పంపండి.",
                "మీకు లక్కీ డ్రా లో బహుమతి వచ్చింది. ప్రాసెసింగ్ ఫీజు రూ.{fee} యూపీఐ: {upi} కి పంపండి.",
                "లాటరీ విజేత! మీరు రూ.{amt} గెలుచుకున్నారు. రిజిస్ట్రేషన్ ఫీజు రూ.{fee} యూపీఐ: {upi} కి పంపండి.",
                "మీ ఫోన్ నంబర్ కు కేబీసీ లాటరీ రూ.{amt} లభించింది. వాట్సాప్ చేయండి: {phone}.",
                "అభినందనలు, బహుమతి క్లెయిమ్ కోసం ట్యాక్స్ ఫీజు రూ.{fee} యూపీఐ: {upi} కి పంపండి.",
                "లక్కీ డ్రా బహుమతి రూ.{amt}. ప్రాసెసింగ్ చార్జీలు రూ.{fee} యూపీఐ: {upi} కి పంపండి.",
                "మీకు రూ.{amt} నగదు బహుమతి వచ్చింది. కస్టమ్స్ ఫీజు రూ.{fee} యూపీఐ: {upi} కి పంపండి.",
                "కేబీసీ లాటరీ విభాగం: రూ.{amt} నగదు బహుమతి. ఫైల్ చార్జ్ రూ.{fee} యూపీఐ: {upi} కి పంపండి."
            ],
            "Marketplace Scam": [
                "ఓఎల్ఎక్స్ సెకండ్ హ్యాండ్ బైక్ రూ.{amt}. అడ్వాన్స్ టోకెన్ రూ.{fee} యూపీఐ: {upi} కి పంపండి.",
                "తక్కువ ధరకు ఐఫోన్. బుకింగ్ కోసం అడ్వాన్స్ పే చేయండి. వాట్సాప్: {phone}.",
                "సెకండ్ హ్యాండ్ మొబైల్ రూ.{amt}. బుకింగ్ అడ్వాన్స్ రూ.{fee} యూపీఐ: {upi} కి పంపండి.",
                "టివి అత్యవసర అమ్మకం. ధర రూ.{amt}. అడ్వాన్స్ టోకెన్ రూ.{fee} యూపీఐ: {upi} కి పంపండి.",
                "ఓఎల్ఎక్స్ సోఫా సెట్ రూ.{amt}. కరియర్ చార్జీలు రూ.{fee} యూపీఐ: {upi} కి పంపండి.",
                "కారు అమ్మకానికి ఉంది. ధర రూ.{amt}. టోకెన్ అడ్వాన్స్ రూ.{fee} యూపీఐ: {upi} కి పంపండి.",
                "ఇల్లు ఖాళీ చేస్తున్నాము, ఎసి రూ.{amt}. హోమ్ డెలివరీ అడ్వాన్స్ రూ.{fee} యూపీఐ: {upi} కి పంపండి.",
                "ఐప్యాడ్ రూ.{amt} కి లభించును. బుకింగ్ అడ్వాన్స్ రూ.{fee} యూపీఐ: {upi} కి పంపండి."
            ],
            "Investment Scam": [
                "7 రోజుల్లో మీ డబ్బు రెట్టింపు చేసుకోండి. రోజువారీ {profit}% లాభం. టెలిగ్రామ్ లింక్: {url}.",
                "రూ.{amt} పెట్టుబడి పెట్టండి, రూ.{returns} పొందండి. యూపీఐ: {upi}.",
                "క్రిప్టో ట్రేడింగ్ బాట్: రూ.{amt} పెట్టుబడికి రోజువారీ {profit}% లాభం. లింక్: {url}.",
                "మీ డబ్బు 5 రోజుల్లో రెట్టింపు. ప్రభుత్వ గుర్తింపు పొందిన పథకం. యూపీఐ: {upi}.",
                "స్టాక్ మార్కెట్ సిగ్నల్స్: రూ.{amt} పెట్టుబడి, నెలకు రూ.{returns} లాభం. టెలిగ్రామ్: {url}.",
                "ఫారెక్స్ రోబోట్ రోజువారీ లాభం {profit}%. కనీస పెట్టుబడి రూ.{amt}. రిజిస్ట్రేషన్: {url}.",
                "రోజువారీ వడ్డీ ప్లాన్: రూ.{amt} పెట్టుబడి పెట్టండి, రూ.{returns} పొందండి. లింక్: {url}.",
                "రూ.{amt} పెట్టుబడి పెట్టండి మరియు {profit}% వడ్డీతో గ్యారెంటీ లాభాలు పొందండి. యూపీఐ: {upi}."
            ],
            "Advance Payment Scam": [
                "లోన్ మంజూరు కోసం ప్రాసెసింగ్ ఫీజు రూ.{fee} యూపీఐ: {upi} కి పంపండి.",
                "పార్సెల్ విడుదల కోసం కస్టమ్స్ డ్యూటీ రూ.{fee} యూపీఐ: {upi} కి పంపండి.",
                "మీ లోన్ ఆమోదించబడింది. ఫైల్ చార్జీలు రూ.{fee} యూపీఐ: {upi} కి పంపండి.",
                "పార్సెల్ విమానాశ్రయంలో ఆగిపోయింది. విడుదల కోసం పన్ను రూ.{fee} యూపీఐ: {upi} కి పంపండి.",
                "ముద్రా లోన్ డాక్యుమెంటేషన్ ఫీజు రూ.{fee} యూపీఐ: {upi} కి పంపండి.",
                "విదేశీ కస్టమ్స్ క్లియరెన్స్ పెనాల్టీ రూ.{fee} యూపీఐ: {upi} కి పంపండి.",
                "మీ రీఫండ్ విడుదల కోసం స్టాంప్ డ్యూటీ రూ.{fee} యూపీఐ: {upi} కి పంపండి.",
                "పార్సెల్ డెలివరీ కోసం కస్టమ్స్ క్లియరెన్స్ ఫీజు రూ.{fee} యూపీఐ: {upi} కి పంపండి."
            ],
            "Legitimate": [
                "ఈరోజు సాయంత్రం {time} కి {loc} లో కలుద్దామా {name}?",
                "మీ కరెంట్ బిల్లు రూ.{amt} గడువు {day} తో ముగుస్తుంది.",
                "మీ ఆర్డర్ #{num} విజయవంతంగా డెలివరీ చేయబడింది.",
                "రేపు ఉదయం {time} కి ఆఫీస్ మీటింగ్ ఉంది {name}, తప్పకుండా రండి.",
                "నమస్కారం {name}, దయచేసి ప్రాజెక్ట్ ఫైల్స్ {time} లోగా ఒకసారి తనిఖీ చేయండి.",
                "రేపు మధ్యాహ్నం {time} కి {loc} లో భోజనానికి కలుద్దామా?",
                "మీ మొబైల్ రీఛార్జ్ #{num} విజయవంతంగా పూర్తయింది. ధన్యవాదాలు.",
                "సాయంత్రం {time} కి కాఫీ తాగడానికి {loc} కి వెళ్దామా {name}?"
            ]
        }
    }

    # Helper lists for placeholders
    names = ["Rahul", "Priya", "Amit", "Rohan", "Sneha", "Karan", "Ananya", "Ravi", "Neha", "Vijay", "Suresh", "Vikram", "Aditya", "Pooja", "Arjun", "Deepak", "Divya", "Sanjay", "Jyoti", "Raj"]
    times = ["5 PM", "10 AM", "2 PM", "noon", "evening", "morning", "3 PM", "11 AM"]
    days = ["today", "tomorrow", "Friday", "Monday", "weekend", "Sunday", "Wednesday"]
    locs = ["station", "cafe", "office", "mall", "park", "restaurant", "theater", "metro station"]

    # Generate 4000 total samples
    languages = ["en", "hinglish", "hindi", "telugu"]
    corpus = []
    
    for lang in languages:
        lang_templates = templates[lang]
        # Generate 500 scam and 500 clean samples per language
        for _ in range(500):
            cat = random.choice(categories)
            template = random.choice(lang_templates[cat])
            
            # Fill placeholders
            filled = template.format(
                amt=random.randint(10000, 250000),
                fee=random.randint(1500, 7500),
                profit=random.randint(10, 45),
                returns=random.randint(20000, 500000),
                phone=f"+9198765{random.randint(10000, 99999)}",
                upi=f"claim-reward{random.randint(10, 99)}@upi",
                url=f"http://win-deals-reward-{random.randint(100, 999)}.net/pay",
                num=random.randint(1000, 9999)
            )
            
            # Introduce typo noise randomly (p=0.06)
            if random.random() < 0.4:
                filled = add_typo_noise(filled, p=0.06)
                
            # Introduce unicode obfuscation randomly (p=0.05)
            if random.random() < 0.3:
                filled = add_unicode_obfuscation(filled, p=0.05)
                
            corpus.append({"text": filled, "label": 1, "category": cat, "language": lang})
            
        for _ in range(500):
            template = random.choice(lang_templates["Legitimate"])
            # Format
            filled = template.format(
                name=random.choice(names),
                time=random.choice(times),
                day=random.choice(days),
                loc=random.choice(locs),
                amt=random.randint(200, 3500),
                num=random.randint(100000, 999999)
            )
            
            # Introduce minimal typo noise to legit messages too
            if random.random() < 0.15:
                filled = add_typo_noise(filled, p=0.04)
                
            corpus.append({"text": filled, "label": 0, "category": "None", "language": lang})
            
    # Shuffle corpus to distribute samples evenly
    random.shuffle(corpus)
    
    # Write to messages CSV
    csv_path = "datasets/raw/messages/synthetic_scam_corpus.csv"
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["text", "label", "category", "language"])
        writer.writeheader()
        writer.writerows(corpus)
        
    print(f"Synthetic corpus generated successfully. Total records: {len(corpus)}")

    # Generate companion URL dataset (PhiUSIIL/PhishTank mocks)
    url_data = []
    suspicious_keywords = ["lottery", "verify", "paytm", "sbi", "win", "discount", "free", "kyc"]
    legit_domains = ["google.com", "github.com", "wikipedia.org", "amazon.in", "sbi.co.in", "netflix.com"]
    
    # 2000 URLs
    for i in range(1000):
        # Scam url
        domain = f"secure-login-{random.choice(suspicious_keywords)}-{random.randint(100, 999)}.cfd"
        path = f"/claim-rewards/verify-account"
        full_url = f"https://{domain}{path}"
        url_data.append({"url": full_url, "is_phishing": 1})
        
    for i in range(1000):
        # Legit url
        domain = random.choice(legit_domains)
        path = f"/index/search?q={random.randint(100, 999)}"
        full_url = f"https://{domain}{path}"
        url_data.append({"url": full_url, "is_phishing": 0})
        
    url_csv_path = "datasets/raw/url/synthetic_url_dataset.csv"
    with open(url_csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["url", "is_phishing"])
        writer.writeheader()
        writer.writerows(url_data)

    print("Companion synthetic URL dataset successfully updated.")

if __name__ == "__main__":
    generate_corpus()
