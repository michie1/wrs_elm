module Results.Add exposing (render)

import Html exposing (Html, button, div, text, span, label, input, ul, li, h2, input, i, p)
import Html.Attributes exposing (autofocus, class, id, type_, for, disabled, value, name, checked)
import Html.Events exposing (onInput, onClick, on)
import Json.Decode as Json


--import Material.Button as Button
--import Material.Textfield as Textfield
--import Material.Typography as Typo
--import Material.Options as Options exposing (css)

import App.Msg
import Results.Model
import Races.Model
import Riders.Model exposing (Rider)


riderNameExists : String -> List Rider -> Bool
riderNameExists name riders =
    List.length (List.filter (\rider -> rider.name == name) riders) > 0


render : Races.Model.Race -> Results.Model.ResultAdd -> List Rider -> List Results.Model.Result -> Html App.Msg.Msg
render race resultAdd riders results =
    let
        submitDisabled =
            not (riderNameExists resultAdd.riderName riders)
                || resultAdd.result
                == ""

        -- TODO: button is enabled although result already exists
    in
        div []
            [ h2 [] [ text ("Add result for " ++ race.name) ]
            , div []
                [ div [ class "row" ]
                    [ div [ class "input-field col s6" ]
                        [ input [ id "result"
                                , type_ "text"
                                , onInput App.Msg.SetResultAddResult
                                , autofocus True
                                ] []
                        , label [ for "result" ] [ text "Result" ]
                        ]
                    ]
                , div [ class "row" ]
                    [ div [ class "input-field col s6" ]
                        [ input
                            [ id "rider"
                            , type_ "text"
                            , value resultAdd.riderName
                            , onInput App.Msg.SetResultRiderName
                            , class "autocomplete"
                            ]
                            []
                        , label [ for "rider" ] [ text ("Rider: " ++ resultAdd.riderName) ]
                        ]
                    ]
                ]
            , div [ class "row" ] [ categoryButtons ]
            , div [ class "row" ]
                [ button
                    [ class "waves-effect waves-light btn"
                    , type_ "submit"
                    , onClick App.Msg.ResultAdd
                    , Html.Attributes.name "action"
                    , disabled submitDisabled
                    ]
                    [ text "Add result"
                    , i [ class "material-icons right" ] [ text "send" ]
                    ]
                ]
            ]


resultExists : List Results.Model.Result -> Races.Model.Race -> Riders.Model.Rider -> Bool
resultExists results race rider =
    List.length
        (List.filter
            (\result -> race.id == result.raceId && rider.id == result.riderId)
            results
        )
        == 1


categoryButtonCheck : String -> String -> Results.Model.ResultCategory -> Bool -> Html App.Msg.Msg
categoryButtonCheck categoryName categoryText category isChecked =
    p []
        [ input [ checked isChecked, name "category", type_ "radio", id categoryName, onClick (App.Msg.ResultAddCategory category) ] []
        , label [ for categoryName ] [ text categoryText ]
        ]


categoryButton : String -> String -> Results.Model.ResultCategory -> Html App.Msg.Msg
categoryButton categoryName categoryText category =
    categoryButtonCheck categoryName categoryText category False


categoryButtons : Html App.Msg.Msg
categoryButtons =
    div []
        [ categoryButtonCheck "amateurs" "Amateurs" Results.Model.Amateurs True
        , categoryButton "basislidmaatschap" "Basislidmaatschap" Results.Model.Basislidmaatschap
        , categoryButton "cata" "Cat A" Results.Model.CatA
        , categoryButton "catb" "Cat B" Results.Model.CatB
        ]
