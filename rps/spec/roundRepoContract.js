const Round = require("../src/Round")

function roundRepoContract(RepoClass) {
    describe("round repo", function () {
        let repo

        beforeEach(function () {
            repo = new RepoClass()
        })

        describe("empty", function () {
            describe("when no rounds have been saved", function () {
                it("is empty", function () {
                    expect(repo.isEmpty()).toBe(true)
                })
            })

            describe("when rounds have been saved", function () {
                it("is not empty", function () {
                    repo.save(new Round())

                    expect(repo.isEmpty()).toBe(false)
                })
            })
        })

        describe("retrieve all rounds", function () {
            describe("no rounds have been saved", function () {
                it("returns an empty array", function () {
                    expect(repo.getAll()).toEqual([])
                })
            })

            describe("rounds have been saved", function () {
                it("returns the saved rounds", function () {
                    let round = new Round()

                    repo.save(round)

                    expect(repo.getAll()).toEqual([round])
                })
            })
        })
    })
}

module.exports = roundRepoContract