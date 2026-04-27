module Page.Rider.List.Update exposing (update)

import Page.Rider.List.Model exposing (Model)
import Page.Rider.List.Msg exposing (Msg(..))
import String


update : Msg -> Model -> Model
update msg model =
    case msg of
        OpenPayoutModal ->
            { model | payoutModalOpen = True }

        ClosePayoutModal ->
            { model | payoutModalOpen = False }

        UpdatePayoutBudgetDraft value ->
            { model | payoutBudgetDraft = value }

        SubmitPayoutBudget ->
            case String.toFloat model.payoutBudgetDraft of
                Just payoutBudget ->
                    { model
                        | payoutBudget = payoutBudget
                        , payoutModalOpen = False
                        , showPayoutColumn = True
                    }

                Nothing ->
                    model
