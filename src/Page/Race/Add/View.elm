module Page.Race.Add.View exposing (view)

import Html exposing (Html, p, button, div, text, input, i, h2, label)
import Html.Attributes exposing (value, autofocus, class, name, type_, id, for, checked, disabled)
import Html.Events exposing (onClick, onInput)
import Ui.Calendar
import Data.RaceType as RaceType exposing (RaceType)
import Page.Race.Add.Model exposing (Model)
import Page.Race.Add.Msg as Msg exposing (Msg)


view : Model -> Html Msg
view raceAdd =
    let
        raceName =
            raceAdd.name

        submitDisabled =
            raceName == "" || String.length raceName > 100
    in
        div []
            [ h2 [] [ text "Add Race" ]
            , div []
                [ div [ class "row" ]
                    [ div [ class "col s6 input-field" ]
                        [ input
                            [ id "name"
                            , type_ "text"
                            , onInput Msg.Name
                            , autofocus True
                            , value raceName
                            ]
                            []
                        , label [ for "name" ] [ text "Name" ]
                        ]
                    ]
                , div [ class "row" ] [ raceTypeButtons raceAdd.raceType ]
                , div [] [ Html.map Msg.Calendar (Ui.Calendar.view "en_us" raceAdd.calendar) ]
                , div [ class "row" ]
                    [ div [ class "col s6" ]
                        [ button
                            [ class "waves-effect waves-light btn"
                            , type_ "submit"
                            , onClick Msg.Submit
                            , Html.Attributes.name "action"
                            , disabled submitDisabled
                            ]
                            [ text "Add Race"
                            , i [ class "material-icons right" ] [ text "send" ]
                            ]
                        ]
                    ]
                ]
            ]


raceTypeButtonCheck : String -> String -> RaceType -> RaceType -> Html Msg
raceTypeButtonCheck raceTypeName raceTypeText raceType current =
    let
        isChecked =
            raceType == current
    in
        p []
            [ input [ checked isChecked, name "type", type_ "radio", id raceTypeName, onClick (Msg.RaceType raceType) ] []
            , label [ for raceTypeName ] [ text raceTypeText ]
            ]


raceTypeButtons : RaceType -> Html Msg
raceTypeButtons current =
    div [ class "col s6" ]
        [ label [ class "active" ] [ text "Category" ]
        , raceTypeButtonCheck "classic" "Klassieker" RaceType.Classic current
        , raceTypeButtonCheck "criterum" "Criterium" RaceType.Criterium current
        , raceTypeButtonCheck "regiocross" "Regiocross" RaceType.Regiocross current
        , raceTypeButtonCheck "other" "Other" RaceType.Other current
        ]
