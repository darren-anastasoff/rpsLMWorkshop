const React = require("react")
const ReactDOM = require("react-dom")

const RpsUI = React.createClass({
    getInitialState(){
        return {
            message: null
        }
    },

    submitForm(){
        this.props.rps.playRound(this.state.p1Throw, this.state.p2Throw, this)
    },

    invalid(){
        this.setState({message: "INVALID"})
    },

    tie(){
        this.setState({message: "TIE"})
    },

    winner(player){
        this.setState({message: `${player.toUpperCase()} WINS`})
    },

    p1ThrowChangeHandler(e){
        this.setState({p1Throw: e.target.value})
    },

    p2ThrowChangeHandler(e){
        this.setState({p2Throw: e.target.value})
    },

    render(){
        return (
            <div>
                {this.state.message}
                <input type="text" id="p1Throw" onChange={this.p1ThrowChangeHandler}/>
                <input type="text" id="p2Throw" onChange={this.p2ThrowChangeHandler}/>
                <button id="playButton" onClick={this.submitForm}>Play</button>
                NO HISTORY
            </div>
        )
    }
})

describe("playRound", function () {
    describe("invalid input", function () {
        beforeEach(function () {
            renderApp({
                playRound: function(p1, p2, ui){
                    ui.invalid()
                }
            })
        })

        it("displays INVALID to the user", function () {
            submitPlayForm()

            expect(page()).toContain("INVALID")
        })
    })

    describe("tie", function () {
        beforeEach(function () {
            renderApp({
                playRound: function(p1, p2, ui){
                    ui.tie()
                }
            })
        })

        it("displays TIE to the user", function () {
            submitPlayForm()

            expect(page()).toContain("TIE")
        })
    })

    describe("p1 wins", function () {
        beforeEach(function () {
            renderApp({
                playRound: function(p1, p2, ui){
                    ui.winner("p1")
                }
            })
        })

        it("displays P1 WINS to the user", function () {
            submitPlayForm()

            expect(page()).toContain("P1 WINS")
        })
    })

    describe("p2 wins", function () {
        beforeEach(function () {
            renderApp({
                playRound: function(p1, p2, ui){
                    ui.winner("p2")
                }
            })
        })

        it("displays P2 WINS to the user", function () {
            submitPlayForm()

            expect(page()).toContain("P2 WINS")
        })
    })

    it("sends user input to the playRound use case", function () {
        const playSpy = jasmine.createSpy("playRound")

        renderApp({
            playRound: playSpy
        })

        let p1Throw = "p1 throw value"
        let p2Throw = "p2 throw value"

        input("#p1Throw", p1Throw)
        input("#p2Throw", p2Throw)

        submitPlayForm()

        expect(playSpy).toHaveBeenCalledWith(p1Throw,  p2Throw, jasmine.any(Object))
    })

    describe("when there is no history", function () {
        beforeEach(function () {
            renderApp({
                playRound: function(ui){
                    ui.noHistory()
                }
            })
        })

        it("tells the user 'NO HISTORY'", function () {
            submitPlayForm()

            expect(page()).toContain("NO HISTORY")
        })
    })

    describe("when there is history", function () {
        beforeEach(function () {
            renderApp({
                playRound: function(ui){
                    ui.history([new Round("rock", "paper", "p2")])
                }
            })
        })

        it("shows the user the history", function () {
            submitPlayForm()

            expect(page()).toContain("rock")
            expect(page()).toContain("paper")
            expect(page()).toContain("p2")
        })
    })

    let domFixture


    function input(inputSelector, inputValue) {
        let domInput = document.querySelector(inputSelector);
        domInput.value = inputValue
        domInput.dispatchEvent(new Event("input", {bubbles: true, cancelable: false}))
    }

    function setupDOM() {
        domFixture = document.createElement("div")
        domFixture.id = "rpsApp"
        document.querySelector("body").appendChild(domFixture)
    }

    beforeEach(function () {
        setupDOM()
    })

    afterEach(function () {
        domFixture.remove()
    })

    function renderApp(rps) {
        ReactDOM.render(
            <RpsUI rps={rps}/>,
            domFixture
        )
    }

    function submitPlayForm() {
        document.querySelector("#playButton").click()
    }

    function page() {
        return domFixture.innerText
    }
})