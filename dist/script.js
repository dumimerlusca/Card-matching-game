// ========== Ui Ctrl ============
class UICtrl {
	constructor() {
		this.cardsContainer = document.querySelector(".cards_container");
		this.cards = [];
		this.menuToggler = document.querySelector("#menu_toggler");
		this.closeMenubtn = document.querySelector("#close_menu_btn");
		this.gameMenu = document.querySelector(".game_menu_container");
		this.difficultyBtnsArr = document.querySelectorAll("[data-cards-nr]");
	}

	populateWithCards(cards) {
		let html = " ";
		console.log(cards);
		cards.forEach(card => {
			const cardHtml = `
                <div class="card" data-id="${card.id}">
                    <div class="card_inner">
                        <div class="front">
                        </div>
                        <div class="back">
                            <img src="${card.iconSrc}" alt="">
                        </div>
                        <div class="target"></div>
                    </div>
                </div>
            `;
			html += cardHtml;
		});
		this.cardsContainer.innerHTML = html;
	}

	flipCards(cardsArr) {
		cardsArr.forEach(card => {
			card.classList.add("flip");
			// setTimeout(() => {
			//     this.unflipCards([card])
			// },2000)
		});
	}

	unflipCards(cardsArr) {
		cardsArr.forEach(card => {
			card.classList.remove("flip");
		});
	}

	hideCard(cards) {
		cards.forEach(card => {
			card.style.visibility = "hidden";
		});
	}

	updateBtnClass(btn) {
		this.difficultyBtnsArr.forEach(btn => {
			btn.classList.remove("active");
		});

		btn.classList.add("active");
	}

	changeGridColumns(nr) {
		switch (nr) {
			case "12": {
				this.cardsContainer.style.gridTemplateColumns = "repeat(4, 1fr)";
				break;
			}
			case "16": {
				this.cardsContainer.style.gridTemplateColumns = "repeat(4, 1fr)";
				break;
			}
			case "20": {
				this.cardsContainer.style.gridTemplateColumns = "repeat(5, 1fr)";
				break;
			}
			case "24": {
				this.cardsContainer.style.gridTemplateColumns = "repeat(6, 1fr)";
				break;
			}
			case "30": {
				this.cardsContainer.style.gridTemplateColumns = "repeat(6, 1fr)";
				break;
			}
		}
	}

	showMessage(msg) {
		const msgHtml = `
            <div id="message_modal">
                <h2 class='thin'>${msg}</h2>
            </div>
        `;
		document.body.insertAdjacentHTML("beforeend", msgHtml);
		setTimeout(() => {
			this.removeMessage("message_modal");
		}, 2000);
	}

	removeMessage(id) {
		document.querySelector(`#${id}`).remove();
	}
}

// ========= Data CTRL ===========
class DataCtrl {
	constructor() {
		this.CARDS_NUMBER = 12;
		this.ICONS_LOCATION = "images/";
		this.iconsArr = [
			"img1.png",
			"img2.png",
			"img3.png",
			"img4.png",
			"img5.png",
			"img6.png",
			"img7.png",
			"img8.png",
			"img9.png",
			"img10.png",
			"img11.png",
			"img12.png",
			"img13.png",
			"img14.png",
			"img15.png",
		];
		this.cardsArr = [];
		this.flippedCards = 0;
		this.previousCard = null;
		this.currentCard = null;
		this.canClick = true;
	}

	createCards() {
		let id = 1;
		for (let i = 0; i <= this.CARDS_NUMBER - 1; i++) {
			if (id > this.CARDS_NUMBER / 2) id = 1;
			const iconSrc = `${this.ICONS_LOCATION}${this.iconsArr[id - 1]}`;
			const card = {
				id: id,
				iconSrc: iconSrc,
			};
			this.cardsArr.push(card);
			id++;
		}
		// Randomize array
		this.shuffle(this.cardsArr);
	}

	shuffle(array) {
		let currentIndex = array.length,
			randomIndex;
		// While there remain elements to shuffle...
		while (currentIndex != 0) {
			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;
			// And swap it with the current element.
			[array[currentIndex], array[randomIndex]] = [
				array[randomIndex],
				array[currentIndex],
			];
		}

		return array;
	}

	resetCards(id) {
		this.flippedCards = 0;
		this.currentCard = null;
		this.previousCard = null;
	}

	removeCards(id) {
		for (let i = this.cardsArr.length - 1; i >= 0; i--) {
			if (this.cardsArr[i].id == id) {
				this.cardsArr.splice(i, 1);
			}
		}
	}

	checkGameEnd() {
		console.log(this.cardsArr);
		console.log("Legth", this.cardsArr.length);
		if (this.cardsArr.length === 0) {
			return true;
		}
	}

	activateClick() {
		setTimeout(() => {
			this.canClick = true;
		}, 100);
	}
}
// Sound class
class Sound {
	constructor(src) {
		this.sound = document.createElement("audio");
		this.sound.src = src;
		this.sound.setAttribute("preload", "auto");
		this.sound.setAttribute("controls", "none");
		this.sound.style.display = "none";
		document.body.appendChild(this.sound);
	}

	play = function () {
		this.sound.play();
	};
}

// ============ Main CTRL =============
(function main() {
	const uiCtrl = new UICtrl();
	const dataCtrl = new DataCtrl();
	// Create the sounds
	const flipSound = new Sound("audio/flipCard.wav");
	const winSound = new Sound("audio/winGame.wav");
	const cardMatch = new Sound("audio/cardMatch.wav");

	initEventListeners();
	initData();

	// Event listeners
	function initEventListeners() {
		// Card click
		uiCtrl.cardsContainer.addEventListener("click", e => {
			console.log(isSameCard(e.target.parentElement));
			if (
				e.target.classList.contains("target") &&
				dataCtrl.canClick &&
				!isSameCard(e.target.parentElement)
			) {
				flipSound.play();
				dataCtrl.previousCard = dataCtrl.currentCard;
				dataCtrl.currentCard = e.target.parentElement;

				if (dataCtrl.flippedCards < 2) {
					uiCtrl.flipCards([dataCtrl.currentCard]);
					dataCtrl.flippedCards++;
				}
				console.log(dataCtrl.flippedCards);
				if (dataCtrl.flippedCards === 2)
					checkIfEqual(dataCtrl.previousCard, dataCtrl.currentCard);
			}
		});
		// Menu toggler
		uiCtrl.menuToggler.addEventListener("click", () => {
			uiCtrl.gameMenu.classList.toggle("show");
		});
		// Close menu btn
		uiCtrl.closeMenubtn.addEventListener("click", () => {
			uiCtrl.gameMenu.classList.remove("show");
		});
		// Select difficulty
		uiCtrl.difficultyBtnsArr.forEach(btn => {
			btn.addEventListener("click", () => {
				uiCtrl.updateBtnClass(btn);
				const cardsNr = btn.getAttribute("data-cards-nr");
				uiCtrl.changeGridColumns(cardsNr);
				changeDifficulty(cardsNr);
			});
		});
	}

	function initData() {
		// Create cards arr
		dataCtrl.createCards();
		// Populate ui with cards
		uiCtrl.populateWithCards(dataCtrl.cardsArr);
	}

	function checkIfEqual(previousCard, currentCard) {
		dataCtrl.canClick = false;
		const previousCardId = previousCard.parentElement.getAttribute("data-id");
		const currentCardId = currentCard.parentElement.getAttribute("data-id");
		console.log(previousCardId, currentCardId);
		if (previousCardId === currentCardId) {
			playSound();
			setTimeout(() => {
				uiCtrl.hideCard([
					previousCard.parentElement,
					currentCard.parentElement,
				]);
				dataCtrl.resetCards();
				dataCtrl.removeCards(parseInt(currentCardId));
				if (dataCtrl.checkGameEnd()) {
					initData();
					winSound.play();
					uiCtrl.showMessage("You won!!!");
				}
				dataCtrl.activateClick();
			}, 1500);
		} else {
			setTimeout(() => {
				uiCtrl.unflipCards([previousCard, currentCard]);
				dataCtrl.resetCards(currentCardId);
				dataCtrl.activateClick();
			}, 1000);
		}
	}

	function isSameCard(card) {
		return card === dataCtrl.currentCard;
	}

	function changeDifficulty(cardsNr) {
		dataCtrl.CARDS_NUMBER = cardsNr;
		dataCtrl.cardsArr = [];
		dataCtrl.resetCards();
		console.log(uiCtrl.CARDS_NUMBER);
		initData();
	}

	function playSound() {
		setTimeout(() => {
			cardMatch.play();
		}, 500);
	}
})();
