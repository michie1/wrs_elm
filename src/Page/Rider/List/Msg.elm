module Page.Rider.List.Msg exposing (Msg(..))


type Msg
    = OpenPayoutModal
    | ClosePayoutModal
    | UpdatePayoutBudgetDraft String
    | SubmitPayoutBudget
