module Page.Rider.Edit.View exposing (view)

import Component.SubmitButton
import Data.Licence as Licence exposing (Licence)
import Html exposing (Html, div, h2, input, label, span, text)
import Html.Attributes exposing (checked, class, for, id, name, type_)
import Html.Events exposing (onClick)
import Page.Rider.Edit.Model exposing (Model)
import Page.Rider.Edit.Msg as Msg exposing (Msg)


view : Model -> Html Msg
view riderEdit =
    div []
        [ h2 [ class "title is-2" ] [ text riderEdit.riderName ]
        , div [ class "field" ]
            [ label [ class "label" ] [ text "Current KNWU Licence" ]
            , div [] [ text <| Licence.licenceLabel riderEdit.currentLicence ]
            ]
        , div [ class "field" ]
            [ label [ class "label" ] [ text "KNWU Licence" ]
            , licenceButtons riderEdit.licence
            ]
        , div [ class "field" ]
            [ div [ class "control" ]
                [ Component.SubmitButton.view
                    { text = "Edit rider"
                    , onClick = Msg.Submit
                    , isDisabled = False
                    , name = Just "action"
                    }
                ]
            ]
        ]


licenceButtonCheck : Licence -> Licence -> Html Msg
licenceButtonCheck licence current =
    let
        isChecked =
            licence == current

        licenceName =
            Licence.licenceToString licence

        licenceText =
            Licence.licenceLabel licence
    in
    label [ class "radio", for licenceName ]
        [ input [ checked isChecked, name "licence", type_ "radio", id licenceName, onClick (Msg.Licence licence) ] []
        , span [] [ text licenceText ]
        ]


licenceButtons : Licence -> Html Msg
licenceButtons current =
    div []
        (Licence.selectableLicences
            |> List.map (\licence -> licenceButtonCheck licence current)
        )
