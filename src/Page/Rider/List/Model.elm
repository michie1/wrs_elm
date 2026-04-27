module Page.Rider.List.Model exposing (Model, initial)


type alias Model =
    { showPayoutColumn : Bool
    , payoutModalOpen : Bool
    , payoutBudget : Float
    , payoutBudgetDraft : String
    }


initial : Model
initial =
    { showPayoutColumn = False
    , payoutModalOpen = False
    , payoutBudget = 1000
    , payoutBudgetDraft = "1000"
    }
