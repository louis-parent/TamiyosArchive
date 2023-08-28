import cardCollection from "./collection/CardCollection.js";
import StareAtMouse from "https://cdn.jsdelivr.net/gh/louis-parent/Barb@latest/scripts/StareAtMouse.js";

document.addEventListener("DOMContentLoaded", () => {	
	cardCollection.asCardList().then(items => {
		document.querySelector("#cards").innerHTML = "";
		
		items.forEach(item => {
			const container = document.createElement("a");
			container.classList.add("card");
			container.href = `card.html?set=${item.card.setCode}&collector_number=${item.card.collectorNumber}&lang=${item.inCollection.language}`;
			container.style.position = "relative";
			container.style.width = "15vw";
			container.style.minWidth = "256px";
			container.style.height = "20.92vw";
			container.style.minHeight = "357px";
			container.style.margin = "1vw";
			container.style.display = "inline-block";
			
			const imgRecto = document.createElement("img");
			imgRecto.classList.add("full-width", "recto");
			imgRecto.alt = item.card.oracle.name.split("//")[0].trim();
			imgRecto.src = item.card.faces[0];
			imgRecto.style.position = "absolute";
			container.appendChild(imgRecto);
			
			if(item.card.faces.length > 1) {
				const imgVerso = document.createElement("img");
				imgVerso.classList.add("full-width", "verso");
				imgVerso.alt = item.card.oracle.name.split("//")[1].trim();
				imgVerso.src = item.card.faces[1];
				imgVerso.style.display = "none";
				imgVerso.style.position = "absolute";
				container.appendChild(imgVerso);
			
				const reverse = document.createElement("button");
				reverse.classList.add("cta", "primary", "floating");
				reverse.innerText = "⭮";
				reverse.style.position = "absolute";
				reverse.style.top = "1%";
				reverse.style.left = "50%";
				reverse.style.transform = "translateX(-50%)";
				reverse.style.zIndex = "100";
				
				let isRectoVisible = true;
				reverse.addEventListener("click", () => {
					imgVerso.style.display = null;
					
					if(isRectoVisible) {
						imgRecto.style.animation = "fromVisibleToHidden 1s ease-in-out forwards";
						imgVerso.style.animation = "fromHiddenToVisible 1s ease-in-out forwards";
						isRectoVisible = false;
					}
					else {
						imgRecto.style.animation = "fromHiddenToVisible 1s ease-in-out forwards";
						imgVerso.style.animation = "fromVisibleToHidden 1s ease-in-out forwards";
						isRectoVisible = true;
					}
				});
				
				container.appendChild(reverse);
			}
			
			const pill = document.createElement("div");
			pill.innerHTML = item.nonFoilCount + " / " + item.foilCount + "<small>✨</small>";
			pill.style.position = "absolute";
			pill.style.left = "50%";
			pill.style.bottom = "5%";
			pill.style.backgroundColor = "var(--primary-color)";
			pill.style.color = "var(--on-primary-color)";
			pill.style.borderRadius = "1em";
			pill.style.padding = "0.25em 0.5em";
			pill.style.transform = "translateX(-50%)";
			pill.style.zIndex = "100";
			container.appendChild(pill);
			
			StareAtMouse.watch(container);
			document.querySelector("#cards").appendChild(container);
		});
	});
	
	document.querySelector("#export").addEventListener("click", async () => {
		const csv = await cardCollection.toCSV();
		const blob = new Blob([csv]);
		const downloader = document.createElement("a");
		downloader.download = "export.csv";
		downloader.type = "text/csv";
		downloader.href = URL.createObjectURL(blob);
		downloader.click();
	});
});
