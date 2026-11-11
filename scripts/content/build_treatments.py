"""Source of truth for the treatment pages. Edit the text here, then regenerate:

    python3 scripts/content/build_treatments.py

Writes src/data/treatments.json (slug, title, description, body HTML). Pages are rendered by
src/pages/Treatment.tsx; slugs must match the routes in src/config/site.ts.
"""
import json
from html import escape
from pathlib import Path

CLINIC = "Family Dental Care Center"
CITY = "Nepalgunj"
QUOTE = (f"Every case is different, so we confirm the cost after an examination at {CLINIC}. "
         "Call or message us and we will be happy to give you an estimate.")


def h(text): return f"<h3>{escape(text)}</h3>"
def p(text): return f"<p>{text}</p>"   # trusted inline HTML allowed (<strong>, <em>)
def ul(*items): return "<ul>" + "".join(f"<li>{i}</li>" for i in items) + "</ul>"
def img(src, alt): return f'<img src="{src}" alt="{escape(alt)}" loading="lazy">'


PAGES = [
    dict(
        slug="root-canal-treatment",
        title=f"Root Canal Treatment in {CITY}",
        description=f"Gentle root canal treatment in {CITY} to stop tooth pain, clear infection and keep your natural tooth. Book a visit at {CLINIC}.",
        body=[
            p("A deep cavity, a crack or an old filling that has leaked can let bacteria reach the soft centre of a tooth, "
              "called the <strong>pulp</strong>. Once the pulp is infected, the tooth usually aches, reacts to hot and cold, "
              "or makes the gum swell. Root canal treatment removes that infection so the tooth can be kept instead of pulled out."),
            img("/img/photos/root-canal.jpg", "Dentist examining dental X-rays on a light box"),
            h("Signs you may need a root canal"),
            ul("Throbbing pain that wakes you up or lasts a long time",
               "Sensitivity to hot or cold that lingers after the food is gone",
               "Pain when biting or chewing on one side",
               "A swelling or small pimple on the gum near a tooth",
               "A tooth that has turned darker than its neighbours"),
            h("What happens during treatment"),
            p("The area is first numbed with local anaesthetic. The dentist makes a small opening in the top of the tooth, "
              "cleans out the infected pulp, and shapes and disinfects each canal. The canals are then sealed so bacteria "
              "cannot return. Most patients say it feels much like having a filling."),
            h("Why a crown is recommended afterwards"),
            p("A tooth that needed a root canal has often lost a lot of its structure, and without its pulp it becomes more "
              "brittle over time. A custom-made <strong>crown</strong> covers and protects it, so it can keep chewing safely "
              "for many years. We take a measurement of the tooth and fit the finished crown at a later visit."),
            h("How many visits will it take?"),
            p("Straightforward cases can often be finished in a single sitting. Teeth with a severe infection may need two "
              "or more visits, with medicine placed inside the tooth between appointments to settle it down."),
            h("Cost of root canal treatment"),
            p(QUOTE),
            p(f"Toothache rarely goes away on its own. If a tooth is bothering you, visit {CLINIC} in {CITY} early, while it can still be saved."),
        ],
    ),
    dict(
        slug="wisdom-tooth-removal",
        title=f"Wisdom Tooth Removal in {CITY}",
        description=f"Safe wisdom tooth removal and minor oral surgery in {CITY} under local anaesthesia. Relief from pain, swelling and crowding.",
        body=[
            h("Oral Surgery"),
            p("Wisdom teeth are the third molars at the very back of the mouth. They usually come through between the ages "
              "of 17 and 25, long after the other teeth have settled, so there is often not enough room for them."),
            img("/img/photos/wisdom-tooth.jpg", "Panoramic dental X-ray showing all teeth, including wisdom teeth"),
            h("Why wisdom teeth cause trouble"),
            p("When a wisdom tooth is blocked by bone or the tooth in front, it is called <strong>impacted</strong>. It may "
              "come through only partly, leaving a flap of gum where food collects. This can lead to:"),
            ul("Pain and swelling at the back of the jaw",
               "Gum infection (pericoronitis) and a bad taste",
               "Decay in the wisdom tooth or the molar beside it",
               "Difficulty opening the mouth fully"),
            h("Does it always need to be removed?"),
            p("No. A wisdom tooth that is upright, fully through and easy to clean can stay. We take an X-ray to see its "
              "position and roots, and only recommend removal when it is causing problems or is likely to."),
            h("How the procedure is done"),
            p("The area is fully numbed. A tooth that has erupted can usually be removed simply. An impacted tooth may need "
              "a small opening in the gum, and sometimes the tooth is divided into pieces so it comes out more gently. "
              "A few stitches may be placed, and you will get clear aftercare instructions."),
            h("Recovery"),
            p("Some swelling and soreness for a few days is normal. Soft food, the medicines we prescribe and gentle salt-water "
              "rinses after the first day help healing. Avoid smoking and using a straw while the area heals."),
            h("Cost of wisdom tooth removal"),
            p(QUOTE),
        ],
    ),
    dict(
        slug="gum-treatment",
        title=f"Gum Treatment in {CITY}",
        description=f"Treatment for bleeding, swollen or receding gums in {CITY}. Deep cleaning and gum care to protect your teeth.",
        body=[
            h("Gum Treatment"),
            p("Healthy gums are firm, pink and do not bleed when you brush. When plaque and tartar build up along the gum line, "
              "the gums become inflamed. This early stage is called <strong>gingivitis</strong>, and it can be reversed. "
              "Left alone, it can progress to <strong>periodontitis</strong>, where the bone holding the teeth is slowly lost."),
            img("/img/photos/gum-treatment.jpg", "Dentist examining a patient's teeth and gums"),
            h("Warning signs"),
            ul("Gums that bleed while brushing or flossing",
               "Red, puffy or tender gums",
               "Bad breath that keeps coming back",
               "Gums pulling away from the teeth, or teeth that feel loose"),
            h("How we treat gum disease"),
            p("Treatment starts with a thorough cleaning to remove tartar above and below the gum line. Where the gums have "
              "formed deeper pockets, we carry out <strong>deep cleaning</strong> (root planing) to smooth the root surfaces so "
              "the gum can reattach. We then show you the brushing and cleaning routine that keeps the problem from returning."),
            p(f"If your gums bleed, don't ignore it. Book a gum check-up at {CLINIC}, {CITY}."),
        ],
    ),
    dict(
        slug="braces-treatment",
        title=f"Braces Treatment in {CITY}",
        description=f"Braces for children and adults in {CITY} to straighten crooked teeth, close gaps and correct the bite.",
        body=[
            p("Straight teeth are not only about looks. Teeth that are crowded or overlapping are harder to clean, and a bite "
              "that doesn't meet properly can wear teeth unevenly or strain the jaw. <strong>Braces</strong> move teeth slowly "
              "and safely into a better position."),
            img("/img/photos/braces.jpg", "Close-up of teeth with metal braces"),
            h("Who can benefit from braces?"),
            ul("Crowded or crooked teeth",
               "Gaps between teeth",
               "Upper teeth that stick out (overjet) or a deep bite",
               "An underbite, crossbite or open bite",
               "Teeth that have drifted after a tooth was lost"),
            p("There is no upper age limit. Many adults choose braces too, as long as the teeth and gums are healthy."),
            h("How braces move teeth"),
            p("Small brackets are bonded to the teeth and connected by a thin archwire. The wire applies gentle, steady pressure, "
              "and the bone around each tooth slowly remodels to let it move. We adjust the wire at regular visits to guide "
              "the teeth step by step."),
            h("Types of braces"),
            ul("<strong>Metal braces</strong>: strong, reliable and the most economical option",
               "<strong>Ceramic braces</strong>: tooth-coloured brackets that are less noticeable",
               "<strong>Clear aligners</strong>: removable transparent trays, suitable for many cases"),
            h("Starting treatment"),
            p("We begin with an examination, photographs and X-rays to plan exactly how the teeth need to move. You will know "
              "the expected treatment time and the type of brace that suits you before anything starts."),
            h("How long does it take?"),
            p("Most treatments last between one and two years, depending on how much correction is needed. After the braces "
              "come off, a <strong>retainer</strong> keeps the teeth in their new position."),
            h("Cost of braces"),
            p(QUOTE),
        ],
    ),
    dict(
        slug="clear-aligners",
        title=f"Clear Aligners in {CITY}",
        description=f"Clear aligners in {CITY}: nearly invisible, removable trays that straighten teeth without wires or brackets.",
        body=[
            h("Clear Aligners"),
            p("Clear aligners are a series of thin, transparent trays made to fit your teeth exactly. Each set is shaped "
              "slightly differently from the last, so as you move through the series, your teeth shift gradually into line."),
            img("/img/photos/clear-aligners.jpg", "Hands holding clear aligner trays"),
            h("Why people choose aligners"),
            ul("Almost invisible when worn, which suits working adults and students",
               "Removable, so you can eat normally and brush and floss as usual",
               "Smooth plastic with no wires or brackets to rub the cheeks",
               "Fewer emergency visits, because there is nothing to break off"),
            h("Are they right for me?"),
            p("Aligners work very well for mild to moderate crowding, spacing and many bite problems. Some complex cases still "
              "move more predictably with fixed braces. After an examination we will tell you honestly which option suits you."),
            h("How the treatment works"),
            p("We take a detailed record of your teeth and plan the movement of each tooth. Your aligners are then made from "
              "that plan. You change to a new set every one to two weeks and visit us periodically so we can check progress."),
            h("Wearing your aligners"),
            p("For results, aligners need to be worn for about <strong>20 to 22 hours a day</strong>. Take them out to eat or "
              "drink anything other than water, then brush before putting them back in. Each new set may feel tight for a day "
              "or two, which is a sign it is working."),
            h("How long does treatment take?"),
            p("Simple cases may finish in a few months; others take a year or more. A retainer is used afterwards to hold the result."),
            h("Cost of clear aligners"),
            p(QUOTE),
        ],
    ),
    dict(
        slug="dental-veneers",
        title=f"Dental Veneers in {CITY}",
        description=f"Porcelain and composite veneers in {CITY} to improve the shape, colour and size of front teeth.",
        body=[
            h("Dental Veneers"),
            p("A veneer is a very thin, tooth-coloured shell that is bonded to the front surface of a tooth. Veneers are used to "
              "give teeth a better shape, colour or size, and can transform a smile with only a small change to the natural tooth."),
            img("/img/photos/veneers.jpg", "Woman with a bright, natural smile"),
            h("What veneers can correct"),
            ul("Stains that whitening cannot remove",
               "Chipped, worn or slightly broken edges",
               "Small gaps between front teeth",
               "Teeth that are uneven in length or slightly out of line"),
            h("Porcelain or composite?"),
            p("<strong>Porcelain veneers</strong> are made in a dental laboratory. They resist staining and look very natural. "
              "<strong>Composite veneers</strong> are built up directly on the tooth in one visit and cost less, but may need "
              "polishing or repair over the years."),
            h("The process"),
            p("We first plan the shape and shade with you. For porcelain veneers, a thin layer of enamel is gently reshaped, a "
              "measurement is taken, and temporary covers are placed while the lab makes your veneers. At the next visit they "
              "are tried in, adjusted and bonded in place."),
            h("Does it hurt?"),
            p("Only a small amount of enamel is shaped, and local anaesthetic is used when needed, so the procedure is comfortable."),
            h("How long do veneers last?"),
            p("With good care, porcelain veneers often last 10 years or more. Avoid biting very hard objects, wear a night guard "
              "if you grind your teeth, and keep up regular check-ups."),
            h("Cost of veneers"),
            p(QUOTE),
        ],
    ),
    dict(
        slug="digital-smile-design",
        title=f"Digital Smile Designing in {CITY}",
        description=f"Digital Smile Design in {CITY}: preview your new smile before treatment begins.",
        body=[
            h("Digital Smile Designing"),
            p("Digital Smile Design (DSD) lets you see a preview of your new smile before any treatment starts. Using photos "
              "and videos of your face and teeth, we design the ideal tooth shape, length and colour to suit your features."),
            img("/img/photos/digital-smile.jpg", "Dentist reviewing a 3D dental scan on a tablet"),
            h("How it works"),
            ul("We take photographs and short videos of you smiling and talking",
               "The design is planned on screen, in proportion to your lips and face",
               "You review the preview with us and we adjust it together",
               "The approved design guides your veneers, crowns, aligners or whitening"),
            h("Benefits of the DSD"),
            ul("You can see the expected result in advance",
               "A smile that is planned to suit your face, not just your teeth",
               "Clearer communication between you and your dentist",
               "More predictable cosmetic treatment"),
            p(f"Curious how your smile could look? Ask about a smile design consultation at {CLINIC}."),
        ],
    ),
    dict(
        slug="teeth-whitening",
        title=f"Teeth Whitening in {CITY}",
        description=f"Professional teeth whitening in {CITY}: a safe, dentist-supervised way to brighten your smile.",
        body=[
            h("Teeth Whitening"),
            p("Tea, coffee, tobacco and simply getting older can all darken the colour of teeth. Professional whitening lightens "
              "these stains and gives a brighter, fresher-looking smile. It is a cosmetic treatment, and the aim is a natural, "
              "healthy shade rather than an artificial bright white."),
            img("/img/photos/teeth-whitening.jpg", "Close-up of a bright white smile"),
            h("In-clinic and home whitening"),
            p("<strong>In-clinic whitening</strong> uses a professional gel applied while the gums are protected, and gives "
              "a visible change in a single visit. <strong>Home whitening</strong> uses custom-fitted trays and a milder gel "
              "worn for a set time each day over one to two weeks."),
            h("Is whitening safe for my enamel?"),
            p("When carried out or supervised by a dentist, whitening is safe for the enamel. Some people notice temporary "
              "sensitivity for a day or two, which settles on its own. We check your teeth first, because cavities or gum "
              "problems should be treated before whitening."),
            h("Things to know before whitening"),
            ul("Fillings, crowns and veneers do not change colour",
               "Whitening is usually postponed during pregnancy",
               "Avoid strongly coloured food and drinks for 48 hours afterwards",
               "Results last longer if you avoid smoking and keep up cleaning visits"),
            h("Cost of teeth whitening"),
            p(QUOTE),
        ],
    ),
    dict(
        slug="dental-implants",
        title=f"Dental Implants in {CITY}",
        description=f"Dental implants in {CITY}: a fixed, natural-looking replacement for missing teeth.",
        body=[
            h("Dental Implant"),
            p("A dental implant replaces the root of a missing tooth. It is a small post, usually made of titanium, that is placed "
              "in the jawbone. Once it has bonded with the bone, a crown is attached on top, giving you a tooth that looks and "
              "works much like the original."),
            img("/img/photos/dental-implant.jpg", "Model of a dental implant between natural teeth"),
            h("Why choose an implant?"),
            ul("Fixed in place, with nothing to remove at night",
               "Neighbouring teeth do not need to be trimmed, as they would for a bridge",
               "Helps preserve the jawbone where the tooth was lost",
               "Comfortable to chew with, and cleaned like a natural tooth"),
            h("The treatment, step by step"),
            p("We first examine the area and take X-rays to check the amount of bone. The implant is placed under local anaesthetic "
              "in a minor procedure. Over the next few months it fuses with the bone (osseointegration). Finally, a custom crown "
              "is made to match your other teeth and fixed onto the implant."),
            h("Is it painful?"),
            p("The procedure is done under local anaesthesia, so you should not feel pain during it. Mild soreness for a few days "
              "afterwards is common and is easily managed with the medicine we prescribe."),
            h("Am I suitable for an implant?"),
            p("Most healthy adults are. Conditions such as uncontrolled diabetes, heavy smoking or very thin bone can affect "
              "healing, so we assess your general health and bone before recommending treatment."),
            h("Cost of a dental implant"),
            p(QUOTE),
        ],
    ),
    dict(
        slug="crown-and-bridges-treatment",
        title=f"Crown & Bridges Treatment in {CITY}",
        description=f"Dental crowns to protect weak teeth and bridges to replace missing teeth, at {CLINIC}, {CITY}.",
        body=[
            h("Dental Crowns (Caps)"),
            p("A crown is a cover that fits over the whole visible part of a tooth. It restores the tooth's shape and strength "
              "when a filling alone would not be enough."),
            img("/img/photos/crown-bridge.jpg", "Dental technician finishing a dental prosthesis"),
            h("When is a crown needed?"),
            ul("After root canal treatment, to protect the tooth",
               "For a tooth that is cracked, badly broken or heavily filled",
               "To improve the look of a misshapen or discoloured tooth",
               "On top of a dental implant"),
            p("Crowns can be made in metal-ceramic, full ceramic or zirconia. We will help you choose based on the position "
              "of the tooth, strength and appearance."),
            h("Dental Bridge"),
            p("A bridge replaces one or more missing teeth by joining an artificial tooth to crowns on the teeth either side of "
              "the gap. It is fixed in place and fills the space, which also stops the neighbouring teeth from drifting."),
            h("How crowns and bridges are made"),
            p("At the first visit the supporting teeth are shaped, a measurement is taken and a temporary cover is fitted. "
              "The final crown or bridge is made to match your tooth colour, then checked and cemented at the next visit."),
            h("Looking after them"),
            p("Brush twice a day, clean under the bridge with floss threaders or interdental brushes, and keep up regular "
              "check-ups. With good care, crowns and bridges can last for many years."),
        ],
    ),
    dict(
        slug="denture",
        title=f"Full Mouth Denture in {CITY}",
        description=f"Complete and partial dentures in {CITY} to restore your smile, chewing and speech.",
        body=[
            h("Dentures"),
            p("When many or all teeth are missing, eating and speaking become difficult and the face can look sunken. "
              "A denture is a removable replacement that restores the teeth and supports the lips and cheeks."),
            img("/img/photos/denture.jpg", "Complete denture on a dental model"),
            h("Types of dentures"),
            ul("<strong>Complete dentures</strong> replace all the teeth in the upper or lower jaw",
               "<strong>Partial dentures</strong> fill gaps when some natural teeth remain",
               "<strong>Implant-supported dentures</strong> clip onto implants for extra stability"),
            h("Benefits"),
            ul("Chew a wider range of food more comfortably",
               "Speak more clearly",
               "Restore the fullness of the face and the look of your smile",
               "An affordable way to replace many teeth"),
            h("Getting used to dentures"),
            p("New dentures can feel strange at first. Start with soft food cut into small pieces and chew on both sides. "
              "Speaking may feel different for a few days. Small sore spots are common and we can adjust the fit at a review visit."),
            h("Caring for dentures"),
            p("Take them out and clean them daily, rinse after meals, and keep them in water overnight. Have them checked "
              "regularly, because the gums and bone change shape over time."),
            h("Cost of dentures"),
            p(QUOTE),
            h(f"Why choose {CLINIC}?"),
            p(f"{CLINIC} on Redcross Road, {CITY}, has cared for patients since 2018. Our dentists take time to make sure "
              "your dentures fit comfortably and look natural."),
        ],
    ),
    dict(
        slug="fmr",
        title="Full Mouth Rehabilitation",
        description=f"Full mouth rehabilitation in {CITY}: rebuilding worn, broken or missing teeth for a healthy, comfortable bite.",
        body=[
            h("Full Mouth Rehabilitation"),
            p("Full mouth rehabilitation is a planned treatment that rebuilds or replaces all the teeth in both jaws. It brings "
              "together several treatments, such as crowns, bridges, implants and root canals, to restore comfortable chewing, "
              "a stable bite and a natural-looking smile."),
            img("/img/photos/full-mouth-rehab.jpg", "Dentist pointing to an implant on a full-arch dental model"),
            h("Who may need it?"),
            ul("People whose teeth are severely worn down, for example from grinding",
               "Several broken, decayed or missing teeth",
               "A bite that has collapsed or causes jaw pain",
               "Previous dental work that has failed in many places"),
            h("How it is planned"),
            p("We start with a complete examination, X-rays, photographs and models of your teeth. A step-by-step plan is made "
              "and explained to you, often with a trial set-up so you can see the planned result. Treatment is then done in "
              "stages over several visits."),
        ],
    ),
    dict(
        slug="cavity-filling",
        title=f"Tooth Colored Fillings in {CITY}",
        description=f"Tooth-coloured fillings in {CITY} to repair cavities and chipped teeth with a natural look.",
        body=[
            h("Cavity Filling"),
            p("A cavity is a hole in a tooth caused by decay. In the early stages it may not hurt at all, which is why regular "
              "check-ups matter. Treating a cavity while it is small keeps the repair simple and protects the nerve of the tooth."),
            img("/img/photos/cavity-filling.jpg", "Dentist examining a tooth with a mirror and probe"),
            h("How a filling is done"),
            p("The tooth is numbed if needed, the decay is removed and the area is cleaned. The space is then filled and shaped "
              "to fit your bite. Most fillings are completed in one short visit."),
            h("Types of fillings"),
            ul("<strong>Composite (tooth-coloured)</strong>: matched to your tooth shade and bonded to the tooth",
               "<strong>Glass ionomer</strong>: releases fluoride, often used for children's teeth and near the gum line",
               "<strong>Ceramic inlays and onlays</strong>: lab-made for larger repairs on back teeth"),
            p("Tooth-coloured fillings are our usual choice because they blend in with the tooth and need less drilling."),
        ],
    ),
    dict(
        slug="kids-dental-treatment",
        title=f"Kids Dental Treatment in {CITY}",
        description=f"Friendly dental care for children in {CITY}: check-ups, fillings, fluoride and sealants.",
        body=[
            h("Pediatric Dentistry"),
            p("Good dental habits start early. Milk teeth help children chew, speak clearly and hold space for the adult teeth, "
              "so they deserve the same care as permanent teeth. We aim to make every visit calm and friendly, so children "
              "grow up without a fear of the dentist."),
            img("/img/photos/kids-dental.jpg", "Young boy at a dental check-up"),
            h("Treatments we offer for children"),
            ul("Check-ups and gentle cleaning",
               "Fluoride application to strengthen enamel",
               "Pit and fissure sealants to protect back teeth from decay",
               "Tooth-coloured fillings and treatment of decayed milk teeth",
               "Advice on thumb-sucking, teething and early orthodontic problems"),
            h("When should the first visit be?"),
            p("We recommend a first check-up by the child's first birthday, or when the first tooth appears. After that, "
              "a visit every six months helps catch problems early."),
            h("Tips for parents"),
            ul("Clean your child's teeth twice a day with a smear of fluoride toothpaste",
               "Avoid putting a child to sleep with a bottle of milk or juice",
               "Limit sweets and sugary drinks between meals",
               "Help with brushing until about age 7 or 8"),
        ],
    ),
    dict(
        slug="scaling-polishing",
        title=f"Teeth Cleaning in {CITY}",
        description=f"Professional teeth cleaning (scaling and polishing) in {CITY} for healthier gums and fresher breath.",
        body=[
            p("Even with careful brushing, plaque builds up in places a toothbrush can't reach. Over time it hardens into "
              "<strong>tartar</strong> (calculus), which only a dental professional can remove. A regular cleaning keeps your "
              "gums healthy and your teeth looking their best."),
            img("/img/photos/scaling-cleaning.jpg", "Dental professional cleaning a patient's teeth"),
            h("Scaling"),
            p("Scaling removes tartar and stains from the tooth surfaces and just under the gum line, usually with an "
              "ultrasonic instrument and fine hand tools. It is generally comfortable; if your gums are sensitive, we can "
              "numb the area."),
            h("Polishing"),
            p("After scaling, the teeth are polished to remove surface stains and leave them smooth. A smooth surface makes it "
              "harder for plaque to stick again."),
            h("Why regular cleaning matters"),
            ul("Prevents and treats bleeding gums",
               "Freshens breath",
               "Removes tea, coffee and tobacco stains",
               "Lets the dentist spot cavities and other problems early"),
            h("How often should I have a cleaning?"),
            p("Every six months suits most people. If you have gum disease, braces or smoke, we may suggest more frequent visits."),
            h("Cost of teeth cleaning"),
            p(QUOTE),
        ],
    ),
]

# Public URL slug (/treatments/<slug>), display name and care group for each page.
# Old slugs are 301-redirected in public/_redirects.
META = {
    "braces-treatment": ("braces", "Braces", "orthodontics"),
    "clear-aligners": ("clear-aligners", "Clear Aligners", "orthodontics"),
    "root-canal-treatment": ("root-canal", "Root Canal Treatment", "pain-relief"),
    "wisdom-tooth-removal": ("oral-surgery", "Minor Oral Surgery & Wisdom Teeth", "pain-relief"),
    "gum-treatment": ("gum-treatment", "Gum Treatment", "pain-relief"),
    "dental-implants": ("dental-implants", "Dental Implants", "replacement"),
    "crown-and-bridges-treatment": ("crowns-and-bridges", "Crowns & Bridges", "replacement"),
    "denture": ("dentures", "Dentures", "replacement"),
    "fmr": ("full-mouth-rehabilitation", "Full Mouth Rehabilitation", "replacement"),
    "dental-veneers": ("veneers", "Veneers & Laminates", "cosmetic"),
    "teeth-whitening": ("teeth-whitening", "Teeth Whitening", "cosmetic"),
    "digital-smile-design": ("smile-design", "Digital Smile Design", "cosmetic"),
    "kids-dental-treatment": ("kids-dentistry", "Kids Dentistry", "family"),
    "scaling-polishing": ("teeth-cleaning", "Teeth Cleaning (Scaling & Polishing)", "family"),
    "cavity-filling": ("fillings", "Tooth-Coloured Fillings", "family"),
}

out = []
for pg in PAGES:
    slug, name, group = META[pg["slug"]]
    out.append({"slug": slug, "title": name, "group": group, "description": pg["description"], "body": " ".join(pg["body"])})
out.sort(key=lambda x: x["title"])
dest = Path(__file__).resolve().parents[2] / "src" / "data" / "treatments.json"
dest.write_text(json.dumps(out, indent=2, ensure_ascii=False) + "\n")
print(f"wrote {len(out)} pages to {dest}")
